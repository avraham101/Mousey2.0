package Handlers;

import Msgs.Message;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.Queue;

public class ConnectionHandler {

    private static int JSON_LINE=10; //TODO need to delete this, for now it works dont know why....
    private boolean terminate;
    private Queue<Socket> requests;
    private Object lockAccept;
    private Object lockProcess;
    private EncoderDecoder encoderDecoder;

    public ConnectionHandler() {
        terminate = false;
        requests = new LinkedList<>();
        lockAccept = new Object();
        lockProcess = new Object();
        encoderDecoder = new EncoderDecoder();
    }

    //The function accept a request and add hit to the request queue
    public void acceptRequest(Socket request) {
        synchronized (lockAccept) {
            if (!terminate) {
                //System.out.println("Accept");
                requests.add(request);
            }
        }
    }

    //The function process the head request from the Queue
    //note that there are 2 blocks it means that we can steal accept requests while we execute one.
    public void proessRequest() {
        synchronized (lockProcess) {
            if(!terminate ) {
                Socket request = null;
                synchronized (lockAccept) {
                    if (!requests.isEmpty()) {
                        request = requests.poll();
                    }
                    else
                        return;
                }
                try {
                    executeRequest(request);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }
    }

    //The function execute a request
    private void executeRequest(Socket r) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(r.getInputStream()));
        //TODO reciving first line then if GET or POST then do what needed to be done
        String read = "";
        int counter =0;
        do{
            read = in.readLine();
            //System.out.println(read);
            counter++;
        }while(counter!=JSON_LINE); //TODO now need to find a better when to get to the last line of the data!!
        //System.out.println("I am here");
        //now the last read line is the json line
        Message m = encoderDecoder.decode(read);
        Message response = m.execute();
        //if there need to be a response msg for this socket.
        if(response!=null) {
            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(r.getOutputStream(), StandardCharsets.UTF_8));
            String msg = encoderDecoder.encode(response);
            String header = "";
            header += "HTTP/1.0 200 OK\n";
            header += "Connection: close"+"\n";
            header += "Content-Type: text\n";
            header += "Content-Length: "+msg.length()+"\n";
            header +="\n";
            out.write(header);
            out.write(msg);
            out.flush();
            System.out.println("Response sent to Client\n");
        }
        //close the socket
        r.close();
    }
}
