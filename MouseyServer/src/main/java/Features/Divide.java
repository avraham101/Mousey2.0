package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Divide implements Feature {

    private String tag = "Divide";
    private int DIVISOR;
    public Divide(int divisor) {
        this.DIVISOR = divisor;
    }

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = e.getX()/DIVISOR;
            double y = e.getY()/DIVISOR;
            double g = e.getG()/DIVISOR;
            double xx = e.getXx()/DIVISOR;
            double yy = e.getYy()/DIVISOR;
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
