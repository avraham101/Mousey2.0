package Msgs;

import java.awt.*;
import java.awt.event.InputEvent;

public class RollerMsg implements Message {

    private double speed; //if press is true means right click down. false means right click up

    public RollerMsg(double speed) {
        this.speed = speed;
        //System.out.println("Rolelr Msg recived "+speed);
    }

    @Override
    public Message execute() {
        try {
            Robot r = new Robot();
            int roll = (int)speed;
            r.mouseWheel(roll);
        }
        catch (Exception e) {
            System.out.println("Error at Right Click Msg :"+e.getMessage());
        }
        return null;
    }
}
