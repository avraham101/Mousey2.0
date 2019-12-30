package Regression;
import DataTypes.*;

import java.util.List;

public class LinearRegression3{

    public LinearRegression3(){

    }

    //The function create a matrix [3][3] from the satistic
    //post-coditions: the matrix size is 3 on 3
    private double[][] createMatrix(Linear3 l) {
        int n = 3;
        double[][] out = new double[n][n];
        out[0][0] = l.getSigma_x1x1() - (l.getSigma_x1() * l.getSigma_x1()) / l.getN(); //sigma(X1X1)
        out[0][1] = l.getSigma_x1x2() - (l.getSigma_x1() * l.getSigma_x2()) / l.getN(); //sigma(X1X2)
        out[0][2] = l.getSigma_x1x3() - (l.getSigma_x1() * l.getSigma_x3()) / l.getN(); //sigma(X1X3)
        out[1][0] = out[0][1]; //sigma(X1X2)
        out[1][1] = l.getSigma_x2x2() - (l.getSigma_x2() * l.getSigma_x2()) / l.getN(); //sigma(X2X2)
        out[1][2] = l.getSigma_x2x3() - (l.getSigma_x2() * l.getSigma_x3()) / l.getN(); //sigma(X2X3)
        out[2][0] = out[0][2]; //sigma(X1X3)
        out[2][1] = out[1][2]; //sigma(X2X3)
        out[2][2] = l.getSigma_x3x3() - (l.getSigma_x3() * l.getSigma_x3()) / l.getN(); //sigma(X3X3)
        return out;
    }

    //The function cal b from satistic and a certain row in the matrix
    //pre-conditions: the row size is [3]
    private double calB(double[] row, Linear3 l) {
        double sigmaX1Y = l.getSigma_x1y() - (l.getSigma_x1() * l.getSigma_y()) / l.getN();
        double sigmaX2Y = l.getSigma_x2y() - (l.getSigma_x2() * l.getSigma_y()) / l.getN();
        double sigmaX3Y = l.getSigma_x3y() - (l.getSigma_x3() * l.getSigma_y()) / l.getN();
        double part1 = row[0] * sigmaX1Y;
        double part2 = row[1] * sigmaX2Y;
        double part3 = row[2] * sigmaX3Y;
        return part1 + part2 + part3;
    }

    //The function cal b0 from satistic and half equation
    private double calB0(Linear3 l, double b1, double b2, double b3) {
        double y = l.getSigma_y() / l.getN();
        double a = b1 * (l.getSigma_x1() / l.getN());
        double b = b2 * (l.getSigma_x2() / l.getN());
        double c = b3 * (l.getSigma_x3() / l.getN());
        return y - a - b - c;
    }

    //The function cal the mse from the sample and equation For Vy and Vx it depends
    private double calMse(List<LinearData3> map, Equation3 e) {
        double sum = 0;
        for(LinearData3 tmp:map) {
            double x = tmp.getY() - e.solve(tmp.getX1(), tmp.getX2(), tmp.getX3());
            sum = sum + Math.pow(x,2);
        }
        return sum / (map.size()-2);
    }

    //The function get a satistic and create from him an linear equation
    private LinearEquation3 evalEquationFromLinear(Linear3 linear) {
        MatrixHandler matrixHandler = new MatrixHandler();
        double[][] mat = createMatrix(linear);
        double[][] mat_inverse = matrixHandler.matrationInverse(mat,3);
        double b1 = calB(mat_inverse[0],linear);
        double b2 = calB(mat_inverse[1],linear);
        double b3 = calB(mat_inverse[2],linear);
        double b0 = calB0(linear,b1,b2,b3);
        return new LinearEquation3(b0,b1,b2,b3);
    }

    //The function calculate the satistics and then create the linear Equations
    public Equation3 evalEquation(List<LinearData3> map) {
        Linear3 linear3 = new Linear3();
        for(LinearData3 t:map) {
            linear3.addData(t);
        }
        LinearEquation3 equation3 = evalEquationFromLinear(linear3);
        equation3.setMse(calMse(map,equation3));
        return equation3;
    }
}
