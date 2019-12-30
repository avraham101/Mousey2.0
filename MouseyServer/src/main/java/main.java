import Handlers.ConnectionHandler;

import java.io.File;
import java.net.ServerSocket;
import java.net.Socket;

public class main {

    private static int PORT = 1250;

    public static void main(String[]args) throws Exception {
        //String path = "Analyze/Test.csv";
        //File out = new File(path);
        //out.createNewFile();

        ServerSocket server = new ServerSocket(PORT);
        ConnectionHandler handler = new ConnectionHandler();
        System.out.println("Server Started : "+ PORT);
        //second thread that always process sockets to the connection handler
        Thread t = new Thread(()->{ while(true) {
                                        handler.proessRequest();
                                    }});
        t.start();
        //main thread that always accept sockets to the connection handler
        while(true){
            Socket client = server.accept();
            handler.acceptRequest(client);
        }

    }
}
