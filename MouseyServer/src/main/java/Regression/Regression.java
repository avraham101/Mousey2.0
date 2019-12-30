package Regression;

import DataTypes.Equation5;
import DataTypes.RowInMap;
import java.util.List;

public interface Regression {

    Equation5 evalEquationVx(List<RowInMap> map);
    Equation5 evalEquationVx(Equation5 old, List<RowInMap> map, double learnRate);
    Equation5 evalEquationVy(List<RowInMap> map);
    Equation5 evalEquationVy(Equation5 old, List<RowInMap> map, double learnRate);
}
