package Handlers;

import DataTypes.RowInMap;
import Msgs.*;
import com.google.gson.Gson;

public class EncoderDecoder {

    private Gson parser;
    public EncoderDecoder() {
        parser = new Gson();
    }

    //Pre-conditions: the function get a String json that not null
    public Message decode(String json) {
        JsonHollder holder = parser.fromJson(json,JsonHollder.class);
        switch (holder.opCode) {
            case 0: return new GenerationMsg(holder.generation);//Generation Msg
            case 1: return new SpeedMsg(holder.vx,holder.vy);   //Speed Msg
            case 2: return new RightClickMsg(holder.press);     //Right Click Msg
            case 3: return new LeftClickMsg(holder.press);      //Left Click Msg
            case 4: return new RollerMsg(holder.speed);         //Roller Msg
            case 5: return null; //File Msg

        }
        return null;
    }

    public String encode(Message msg) {
        return parser.toJson(msg);
    }


    private class JsonHollder {
        int opCode;
        boolean press;
        double vx;
        double vy;
        double speed;
        RowInMap[] generation;
        public  JsonHollder() {

        }
    }
}
