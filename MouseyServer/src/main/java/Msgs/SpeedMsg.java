package Msgs;

import java.awt.*;

public class SpeedMsg implements Message {

    private double vx;
    private double vy;

    public SpeedMsg(double vx, double vy) {
        this.vx = vx;
        this.vy = vy;
    }

    @Override
    public Message execute() {
        //System.out.println(vx+","+vy);
        try {
            Point mouse = MouseInfo.getPointerInfo().getLocation();
            Robot r = new Robot();
            double x = mouse.x + vx;
            double y = mouse.y + vy;
            r.mouseMove((int)x, (int)y);
        }
        catch (Exception e) {
            System.out.println("Error at Speed Msg : "+e.getMessage());
        }
        return null;
    }
}
