package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Sin implements Feature {

    private String tag = "Sin";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = Math.sin(e.getX());
            double y = Math.sin(e.getY());
            double g = Math.sin(e.getG());
            double xx = Math.sin(e.getXx());
            double yy = Math.sin(e.getYy());
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
