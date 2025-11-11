package com.network.chat;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.SslConnectionFactory;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.websocket.server.config.JettyWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.SecureRequestCustomizer;

import java.io.File;
import java.time.Duration;

public class ChatServer {
    public static void main(String[] args) throws Exception {
        Server server = new Server();

        // Decide connectors: enable SSL if keystore props provided and file exists
        String ksPath = System.getProperty("keystore.path");
        String ksPass = System.getProperty("keystore.pass", "changeit");

        if (ksPath != null && new File(ksPath).exists()) {
            // Configure SSL (WSS)
            SslContextFactory.Server sslContextFactory = new SslContextFactory.Server();
            sslContextFactory.setKeyStorePath(ksPath);
            sslContextFactory.setKeyStorePassword(ksPass);
            sslContextFactory.setKeyManagerPassword(ksPass);

            HttpConfiguration https = new HttpConfiguration();
            https.addCustomizer(new SecureRequestCustomizer());

            ServerConnector sslConnector = new ServerConnector(
                server,
                new SslConnectionFactory(sslContextFactory, "http/1.1"),
                new HttpConnectionFactory(https)
            );
            sslConnector.setPort(8443);
            server.addConnector(sslConnector);
            System.out.println("Configured WSS on port 8443 (keystore=" + ksPath + ")");
        } else {
            // Plain WS fallback
            ServerConnector connector = new ServerConnector(server, new HttpConnectionFactory());
            connector.setPort(8080);
            server.addConnector(connector);
            System.out.println("Configured plain WS on port 8080 (no keystore)");
        }

        // Servlet context for websocket mapping
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);

        // Initialize Jetty WebSocket container and set idle timeout
        JettyWebSocketServletContainerInitializer.configure(context, (servletContext, wsContainer) -> {
            wsContainer.setIdleTimeout(Duration.ofMinutes(30));
            wsContainer.addMapping("/chat", (req, resp) -> new ChatWebSocket());
        });

        try {
            server.start();
            System.out.println("WebSocket endpoint ready at /chat");
            server.join();
        } finally {
            server.stop();
        }
    }
}