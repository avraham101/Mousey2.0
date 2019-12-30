package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Tan implements Feature {

    private String tag = "Tan";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = Math.tan(e.getX());
            double y = Math.tan(e.getY());
            double g = Math.tan(e.getG());
            double xx = Math.tan(e.getXx());
            double yy = Math.tan(e.getYy());
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
