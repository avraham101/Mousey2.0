package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Atan implements Feature {

    private String tag = "Atan";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = Math.atan(e.getX());
            double y = Math.atan(e.getY());
            double g = Math.atan(e.getG());
            double xx = Math.atan(e.getXx());
            double yy = Math.atan(e.getYy());
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
