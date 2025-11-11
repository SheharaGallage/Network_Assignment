// ...existing code...
package com.network.chat;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebSocket
public class ChatWebSocket {

    private static final Map<Session, String> sessions = new ConcurrentHashMap<>();
    private static final Gson gson = new Gson();

    @OnWebSocketConnect
    public void connected(Session session) {
        try {
            if (session == null) {
                System.err.println("[WARN] WebSocket session is null!");
                return;
            }
            sessions.put(session, null);
            System.out.println("[OK] Client connected: " + session.getRemoteAddress());
        } catch (Exception e) {
            System.err.println("[ERROR] Connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void closed(Session session, int status, String reason) {
        try {
            String user = sessions.remove(session);
            if (user != null) {
                broadcastSystem(user + " left the chat");
                broadcastUsers();
            }
            System.out.println("[INFO] Client disconnected: " + session + " (" + reason + ")");
        } catch (Exception e) {
            System.err.println("[ERROR] On close: " + e.getMessage());
        }
    }

    @OnWebSocketMessage
    public void onMessage(Session session, String message) {
        try {
            if (message == null || message.isBlank()) {
                sendError(session, "Empty message");
                return;
            }

            JsonObject obj = JsonParser.parseString(message).getAsJsonObject();
            String type = obj.has("type") ? obj.get("type").getAsString() : "message";

            switch (type) {
                case "join":
                    handleJoin(session, obj);
                    break;
                case "message":
                    handleBroadcast(session, obj);
                    break;
                case "private":
                    handlePrivate(session, obj);
                    break;
                case "note":
                    handleNote(session, obj);
                    break;
                case "theme":
                    handleTheme(session, obj);
                    break;
                case "file":
                    handleFileSignal(session, obj);
                    break;
                case "list":
                    sendUserList(session);
                    break;
                default:
                    sendError(session, "Unknown type: " + type);
            }
        } catch (Exception e) {
            try { sendError(session, "Invalid message format"); } catch (IOException ignored) {}
            e.printStackTrace();
        }
    }

    private void handleJoin(Session session, JsonObject obj) throws IOException {
        String username = obj.has("username") && !obj.get("username").getAsString().isBlank()
                ? obj.get("username").getAsString()
                : ("user-" + Math.abs(session.hashCode()));
        sessions.put(session, username);
        broadcastSystem(username + " joined the chat");
        broadcastUsers();
    }

    private void handleBroadcast(Session session, JsonObject obj) throws IOException {
        String text = obj.has("content") ? obj.get("content").getAsString() : "";
        String from = sessions.get(session);
        if (from == null) from = "Unknown";

        JsonObject out = new JsonObject();
        out.addProperty("type", "message");
        out.addProperty("sender", from);
        out.addProperty("content", text);
        out.addProperty("ts", LocalTime.now().toString());
        broadcast(out.toString());
    }

    private void handlePrivate(Session session, JsonObject obj) throws IOException {
        String to = obj.has("to") ? obj.get("to").getAsString() : null;
        String text = obj.has("content") ? obj.get("content").getAsString() : "";
        String sender = sessions.get(session);
        if (sender == null) sender = "Unknown";
        final String fromFinal = sender;

        JsonObject out = new JsonObject();
        out.addProperty("type", "private");
        out.addProperty("sender", fromFinal);
        out.addProperty("to", to);
        out.addProperty("content", text);
        out.addProperty("ts", LocalTime.now().toString());

        sessions.forEach((s, uname) -> {
            try {
                if (s != null && s.isOpen()) {
                    if ((to != null && to.equals(uname)) || (uname != null && uname.equals(fromFinal))) {
                        s.getRemote().sendString(out.toString());
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private void handleNote(Session session, JsonObject obj) throws IOException {
        String content = obj.has("content") ? obj.get("content").getAsString() : "";
        JsonObject out = new JsonObject();
        out.addProperty("type", "note");
        out.addProperty("content", content);
        out.addProperty("ts", LocalTime.now().toString());
        broadcast(out.toString());
    }

    private void handleTheme(Session session, JsonObject obj) throws IOException {
        String mode = obj.has("mode") ? obj.get("mode").getAsString() : "light";
        JsonObject out = new JsonObject();
        out.addProperty("type", "theme");
        out.addProperty("mode", mode);
        broadcast(out.toString());
    }

    private void handleFileSignal(Session session, JsonObject obj) throws IOException {
        JsonObject out = new JsonObject();
        out.addProperty("type", "file");
        if (obj.has("filename")) out.addProperty("filename", obj.get("filename").getAsString());
        if (obj.has("url")) out.addProperty("url", obj.get("url").getAsString());
        out.addProperty("ts", LocalTime.now().toString());
        broadcast(out.toString());
    }

    private void sendUserList(Session session) throws IOException {
        JsonObject out = new JsonObject();
        out.addProperty("type", "users");
        List<String> list = new ArrayList<>();
        sessions.values().forEach(u -> { if (u != null) list.add(u); });
        out.add("list", gson.toJsonTree(list));
        if (session != null && session.isOpen()) session.getRemote().sendString(out.toString());
    }

    private void broadcastUsers() {
        JsonObject out = new JsonObject();
        out.addProperty("type", "users");
        List<String> list = new ArrayList<>();
        sessions.values().forEach(u -> { if (u != null) list.add(u); });
        out.add("list", gson.toJsonTree(list));
        broadcast(out.toString());
    }

    private void broadcast(String payload) {
        sessions.keySet().forEach(s -> {
            try {
                if (s != null && s.isOpen()) s.getRemote().sendString(payload);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private void broadcastSystem(String text) {
        JsonObject out = new JsonObject();
        out.addProperty("type", "system");
        out.addProperty("text", text);
        out.addProperty("ts", LocalTime.now().toString());
        broadcast(out.toString());
    }

    private void sendError(Session session, String err) throws IOException {
        JsonObject out = new JsonObject();
        out.addProperty("type", "error");
        out.addProperty("message", err);
        if (session != null && session.isOpen()) {
            session.getRemote().sendString(out.toString());
        }
    }
}
