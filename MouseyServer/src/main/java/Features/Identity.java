package Features;

import DataTypes.RowInMap;

import java.util.LinkedList;
import java.util.List;

public class Identity implements Feature {

    private String tag = "Identity";

    @Override
    public List<RowInMap> execute(List<RowInMap> map) {
        List<RowInMap> out = new LinkedList<>();
        for (RowInMap e: map) {
            out.add(e.copy());
        }
        return out;
    }
}
