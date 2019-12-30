package Handlers;

import DataTypes.*;
import Features.*;
import Msgs.*;
import Presestent.ExecelKeeper;
import Regression.*;

import java.util.LinkedList;
import java.util.List;

public class DataHandler {

    private static DataHandler handler;

    public static DataHandler getInstance() {
        if(handler==null) {
            handler = new DataHandler();
        }
        return handler;
    }

    //Vars
    private static double LEARN_RATE = 0.001;
    private int generationNum;      //the car represent how much generations collected
    private List<RowInMap> map;     //the map of the data sensors
    private List<RowInMap> minimap; //the last map added to the sensors map for evalNextGen
    private Regression rx;          //the regreesion type for vx
    private Regression ry;          //the regression type for vy
    private Feature[] fx;           //the features of vx
    private Feature[] fy;           //the features of vy
    private Equation5 vx;           //the equation vx
    private Equation5 vy;           //the equation vy

    private ExecelKeeper execelKeeper;

    private DataHandler() {
        generationNum = 0;
        map = new LinkedList<>();
        minimap = null;
        execelKeeper = new ExecelKeeper();
        vx = null;
        vy = null;
        setFeatures();
        setRegression();
    }

    private void setRegression() {
        rx = new LinearRegression5();
        ry = new LinearRegression5();
    }

    private void setFeatures() {
        System.out.println("Set Features Vx and Vy");
        Feature fx = new Divide(2);
        Feature[] arrX = {fx};
        this.fx = arrX;
        Feature fy1 = new WithOutZGyro();
        Feature fy2 = new Atan();
        Feature[] arrY = {fy1, fy2};
        this.fy = arrY;
    }

    //TODO in the future this will be need to save in the db
    //The function get a new generation of data and add it to the map
    public void addGeneration(List<RowInMap> data) {
        generationNum ++;
        minimap = data;
        map.addAll(data);
        execelKeeper.saveGeneration(generationNum,map);
        System.out.println("current Map size: "+map.size());
    }

    //pre-conditions: the map must not be empty
    public EquationMsg evalGeneration(){
        //0) copy the minimap to 2 maps
        List<RowInMap> xMap = new LinkedList<>();
        xMap.addAll(minimap);
        List<RowInMap> yMap = new LinkedList<>();
        yMap.addAll(minimap);
        //1) execute the fearues on the maps
        for(Feature f:fx)
            xMap = f.execute(xMap);
        for(Feature f:fy)
            yMap = f.execute(yMap);
        //2)execute the regression
        if(generationNum==1) { //first generation Linear Regression
            vx = rx.evalEquationVx(xMap);
            vy = ry.evalEquationVy(yMap);
        }
        else { //Next Generations with gradend desend TODO missing eval for next Generation to Poyominal
            vx = rx.evalEquationVx(vx, minimap, LEARN_RATE);
            vy = ry.evalEquationVy(vy, minimap, LEARN_RATE);
        }
        return new EquationMsg(vx ,vy, fx, fy);
    }
}
