package Msgs;

import java.awt.*;
import java.awt.event.InputEvent;

public class LeftClickMsg implements Message {

    private boolean press; //if press is true means right click down. false means right click up

    public LeftClickMsg(boolean press) {
        this.press = press;
        //System.out.println("Left Click Msg recived");
    }

    @Override
    public Message execute() {
        try {
            Point mouse = MouseInfo.getPointerInfo().getLocation();
            Robot r = new Robot();
            r.mouseMove(mouse.x,mouse.y);
            if(press)
                r.mousePress(InputEvent.BUTTON1_DOWN_MASK);
            else
                r.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
        }
        catch (Exception e) {
            System.out.println("Error at Left Click Msg :"+e.getMessage());
        }
        return null;
    }
}
