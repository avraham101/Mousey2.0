package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Abs implements Feature {

    private String tag = "Abs";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = Math.abs(e.getX());
            double y = Math.abs(e.getY());
            double g = Math.abs(e.getG());
            double xx = Math.abs(e.getXx());
            double yy = Math.abs(e.getYy());
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
