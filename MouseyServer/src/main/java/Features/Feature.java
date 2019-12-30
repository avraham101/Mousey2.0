package Features;
import DataTypes.RowInMap;
import java.util.List;

public interface Feature {

    //The function create a new map that not a mutation!!
    List<RowInMap> execute(List<RowInMap> map);
}
