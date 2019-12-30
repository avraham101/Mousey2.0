package Msgs;

import DataTypes.Equation5;
import Features.Feature;

public class EquationMsg implements Message{

    private int opCode = 100;
    private Equation5 x;
    private Equation5 y;
    private int lenFx;
    private Feature[] fx;
    private int lenFy;
    private Feature[] fy;

    public EquationMsg(Equation5 x, Equation5 y, Feature[] fx, Feature[]fy) {
        this.x = x;
        this.y = y;
        this.fx = fx;
        this.fy = fy;
        this.lenFx = fx.length;
        this.lenFy = fy.length;
    }

    @Override
    public Message execute() {
        return null;
    }

}
