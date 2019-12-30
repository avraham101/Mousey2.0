package Msgs;

import java.awt.*;
import java.awt.event.InputEvent;

public class RightClickMsg implements Message {

    private boolean press; //if press is true means right click down. false means right click up

    public RightClickMsg(boolean press) {
        this.press = press;
    }

    @Override
    public Message execute() {
        try {
            Point mouse = MouseInfo.getPointerInfo().getLocation();
            Robot r = new Robot();
            r.mouseMove(mouse.x,mouse.y);
            if(press)
                r.mousePress(InputEvent.BUTTON3_DOWN_MASK);
            else
                r.mouseRelease(InputEvent.BUTTON3_DOWN_MASK);
        }
        catch (Exception e) {
            System.out.println("Error at Right Click Msg :"+e.getMessage());
        }
        return null;
    }
}
