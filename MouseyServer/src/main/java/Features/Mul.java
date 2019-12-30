package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Mul implements Feature {

    private String tag = "Mul";
    private int MULSOR;
    public Mul(int mulsor) {
        this.MULSOR = mulsor;
    }

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = e.getX()*MULSOR;
            double y = e.getY()*MULSOR;
            double g = e.getG()*MULSOR;
            double xx = e.getXx()*MULSOR;
            double yy = e.getYy()*MULSOR;
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
