package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class WithOutZGyro implements Feature {

    private String tag = "WithOutZGyro";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            double vx = e.getVx();
            double vy = e.getVy();
            double x = e.getX();
            double y = e.getY();
            double g = 0;
            double xx = e.getXx();
            double yy = e.getYy();
            RowInMap tmp = new RowInMap(vx, vy, x, y, g, xx, yy);
            out.add(tmp);
        }
        return out;
    }
}
