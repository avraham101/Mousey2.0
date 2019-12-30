package Regression;
import DataTypes.*;

import java.util.LinkedList;
import java.util.List;

public class PlominalRegression5 implements Regression {

    //The function create the LinearData3 for (y,x,x^2,x^3)
    private LinearData3 evalData(double y,double x) {
        double x2 = Math.pow(x,2);
        double x3 = Math.pow(x,3);
        return new LinearData3(y,x, x2,x3);
    }

    //The function solve the equation3 from data
    private double solveEquation3(LinearData3 data, Equation3 equation3) {
        double b1 = data.getX1();
        double b2 = data.getX2();
        double b3 = data.getX3();
        return equation3.solve(b1,b2,b3);
    }

    @Override
    public Equation5 evalEquationVx(List<RowInMap> map) {
        //1) create the mini maps of regression 3
        List<LinearData3> lx = new LinkedList<>(); //mini map for sensor x
        List<LinearData3> ly = new LinkedList<>(); //mini map for sensor y
        List<LinearData3> lg = new LinkedList<>(); //mini map for sensor g
        List<LinearData3> lxx = new LinkedList<>(); //mini map for sensor xx
        List<LinearData3> lyy = new LinkedList<>(); //mini map for sensor yy
        for(RowInMap tmp:map) {
            double y = tmp.getVx();
            lx.add(evalData(y,tmp.getX()));
            ly.add(evalData(y,tmp.getY()));
            lg.add(evalData(y,tmp.getG()));
            lxx.add(evalData(y,tmp.getX()));
            lyy.add(evalData(y,tmp.getYy()));
        }
        //2) solve the mini maps and get the equation 3
        LinearRegression3 linearRegression3 = new LinearRegression3();
        Equation3 ex = linearRegression3.evalEquation(lx);
        Equation3 ey = linearRegression3.evalEquation(ly);
        Equation3 eg = linearRegression3.evalEquation(lg);
        Equation3 exx = linearRegression3.evalEquation(lxx);
        Equation3 eyy = linearRegression3.evalEquation(lyy);
        //3) run on the data again and solve the equation to create a new regression5
        Linear5 multi = new Linear5();
        for(RowInMap tmp:map) {
            double y = tmp.getVx();
            double x1 = solveEquation3(evalData(y,tmp.getX()),ex);
            double x2 = solveEquation3(evalData(y,tmp.getY()),ey);
            double x3 = solveEquation3(evalData(y,tmp.getG()),eg);
            double x4 = solveEquation3(evalData(y,tmp.getXx()),exx);
            double x5 = solveEquation3(evalData(y,tmp.getYy()),eyy);
            multi.addData(new LinearData5(y, x1, x2, x3, x4, x5));
        }
        //4) now solve the new Linear5
        LinearRegression5 linearRegression5 = new LinearRegression5();
        Equation5 sol = linearRegression5.evalEquationFromLinear(multi);
        PolmiyalEquation5 out = new PolmiyalEquation5(ex,ey,eg,exx,eyy,sol);
        return out;
    }

    @Override //TODO
    public Equation5 evalEquationVx(Equation5 old, List<RowInMap> map, double learnRate) {
        return null;
    }

    @Override
    public Equation5 evalEquationVy(List<RowInMap> map) {
        //1) create the mini maps of regression 3
        List<LinearData3> lx = new LinkedList<>(); //mini map for sensor x
        List<LinearData3> ly = new LinkedList<>(); //mini map for sensor y
        List<LinearData3> lg = new LinkedList<>(); //mini map for sensor g
        List<LinearData3> lxx = new LinkedList<>(); //mini map for sensor xx
        List<LinearData3> lyy = new LinkedList<>(); //mini map for sensor yy
        for(RowInMap tmp:map) {
            double y = tmp.getVy();
            lx.add(evalData(y,tmp.getX()));
            ly.add(evalData(y,tmp.getY()));
            lg.add(evalData(y,tmp.getG()));
            lxx.add(evalData(y,tmp.getX()));
            lyy.add(evalData(y,tmp.getYy()));
        }
        //2) solve the mini maps and get the equation 3
        LinearRegression3 linearRegression3 = new LinearRegression3();
        Equation3 ex = linearRegression3.evalEquation(lx);
        Equation3 ey = linearRegression3.evalEquation(ly);
        Equation3 eg = linearRegression3.evalEquation(lg);
        Equation3 exx = linearRegression3.evalEquation(lxx);
        Equation3 eyy = linearRegression3.evalEquation(lyy);
        //3) run on the data again and solve the equation to create a new regression5
        Linear5 multi = new Linear5();
        for(RowInMap tmp:map) {
            double y = tmp.getVy();
            double x1 = solveEquation3(evalData(y,tmp.getX()),ex);
            double x2 = solveEquation3(evalData(y,tmp.getY()),ey);
            double x3 = solveEquation3(evalData(y,tmp.getG()),eg);
            double x4 = solveEquation3(evalData(y,tmp.getXx()),exx);
            double x5 = solveEquation3(evalData(y,tmp.getYy()),eyy);
            multi.addData(new LinearData5(y, x1, x2, x3, x4, x5));
        }
        //4) now solve the new Linear5
        LinearRegression5 linearRegression5 = new LinearRegression5();
        Equation5 sol = linearRegression5.evalEquationFromLinear(multi);
        PolmiyalEquation5 out = new PolmiyalEquation5(ex,ey,eg,exx,eyy,sol);
        return out;
    }

    @Override //TODO
    public Equation5 evalEquationVy(Equation5 old, List<RowInMap> map, double learnRate) {
        return null;
    }
}
