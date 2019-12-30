package Msgs;

import DataTypes.Equation5;
import DataTypes.RowInMap;
import Handlers.DataHandler;
import javafx.util.Pair;

import java.util.LinkedList;
import java.util.List;

public class GenerationMsg implements Message {

    private RowInMap[] map;
    public GenerationMsg(RowInMap[] map) {
        this.map = map;
    }

    @Override
    public Message execute() {
        DataHandler handler = DataHandler.getInstance();
        List<RowInMap> out = new LinkedList<>();
        System.out.println("Recived "+map.length+" Data from Sensors");
        for(RowInMap e:map) {
            out.add(e);
        }
        handler.addGeneration(out);
        EquationMsg msg = handler.evalGeneration();
        return msg;
    }
}
