package Regression;
import DataTypes.*;

import java.util.List;

public class LinearRegression5 implements Regression{

    public LinearRegression5(){

    }

    //The function create a matrix [5][5] from the satistic
    //post-coditions: the matrix size is 5 on 5
    private double[][] createMatrix(Linear5 l) {
        int n = 5;
        double[][] out = new double[n][n];
        out[0][0] = l.getSigma_x1x1() - (l.getSigma_x1() * l.getSigma_x1()) / l.getN(); //sigma(X1X1)
        out[0][1] = l.getSigma_x1x2() - (l.getSigma_x1() * l.getSigma_x2()) / l.getN(); //sigma(X1X2)
        out[0][2] = l.getSigma_x1x3() - (l.getSigma_x1() * l.getSigma_x3()) / l.getN(); //sigma(X1X3)
        out[0][3] = l.getSigma_x1x4() - (l.getSigma_x1() * l.getSigma_x4()) / l.getN(); //sigma(X1X4)
        out[0][4] = l.getSigma_x1x5() - (l.getSigma_x1() * l.getSigma_x5()) / l.getN(); //sigma(X1X5)
        out[1][0] = out[0][1]; //sigma(X1X2)
        out[1][1] = l.getSigma_x2x2() - (l.getSigma_x2() * l.getSigma_x2()) / l.getN(); //sigma(X2X2)
        out[1][2] = l.getSigma_x2x3() - (l.getSigma_x2() * l.getSigma_x3()) / l.getN(); //sigma(X2X3)
        out[1][3] = l.getSigma_x2x4() - (l.getSigma_x2() * l.getSigma_x4()) / l.getN(); //sigma(X2X4)
        out[1][4] = l.getSigma_x2x5() - (l.getSigma_x2() * l.getSigma_x5()) / l.getN();  //sigma(X2X5)
        out[2][0] = out[0][2]; //sigma(X1X3)
        out[2][1] = out[1][2]; //sigma(X2X3)
        out[2][2] = l.getSigma_x3x3() - (l.getSigma_x3() * l.getSigma_x3()) / l.getN(); //sigma(X3X3)
        out[2][3] = l.getSigma_x3x4() - (l.getSigma_x3() * l.getSigma_x4()) / l.getN(); //sigma(X3X4)
        out[2][4] = l.getSigma_x3x5() - (l.getSigma_x3() * l.getSigma_x5()) / l.getN(); //sigma(X3X5)
        out[3][0] = out[0][3]; //sigma(X1X4)
        out[3][1] = out[1][3]; //sigma(X2X4)
        out[3][2] = out[2][3]; //sigma(X3X4)
        out[3][3] = l.getSigma_x4x4() - (l.getSigma_x4() * l.getSigma_x4() ) / l.getN(); //sigma(X4X4)
        out[3][4] = l.getSigma_x4x5() - (l.getSigma_x4() * l.getSigma_x5() ) / l.getN(); //sigma(X4X5)
        out[4][0] = out[0][4]; //sigma(X1X5)
        out[4][1] = out[1][4]; //sigma(X2X5)
        out[4][2] = out[2][4]; //sigma(X3X5)
        out[4][3] = out[3][4]; //sigma(X4X5)
        out[4][4] = l.getSigma_x5x5() - (l.getSigma_x5() * l.getSigma_x5()) / l.getN(); //sigma(X5X5)
        return out;
    }

    //The function cal b from satistic and a certain row in the matrix
    //pre-conditions: the row size is [5]
    private double calB(double[] row, Linear5 l) {
        double sigmaX1Y = l.getSigma_x1y() - (l.getSigma_x1() * l.getSigma_y()) / l.getN();
        double sigmaX2Y = l.getSigma_x2y() - (l.getSigma_x2() * l.getSigma_y()) / l.getN();
        double sigmaX3Y = l.getSigma_x3y() - (l.getSigma_x3() * l.getSigma_y()) / l.getN();
        double sigmaX4Y = l.getSigma_x4y() - (l.getSigma_x4() * l.getSigma_y()) / l.getN();
        double sigmaX5Y = l.getSigma_x5y() - (l.getSigma_x5() * l.getSigma_y()) / l.getN();
        double part1 = row[0] * sigmaX1Y;
        double part2 = row[1] * sigmaX2Y;
        double part3 = row[2] * sigmaX3Y;
        double part4 = row[3] * sigmaX4Y;
        double part5 = row[4] * sigmaX5Y;
        return part1 + part2 + part3 + part4 + part5;
    }

    //The function cal b0 from satistic and half equation
    private double calB0(Linear5 l, double b1, double b2, double b3, double b4, double b5) {
        double y = l.getSigma_y() / l.getN();
        double a = b1 * (l.getSigma_x1() / l.getN());
        double b = b2 * (l.getSigma_x2() / l.getN());
        double c = b3 * (l.getSigma_x3() / l.getN());
        double d = b4 * (l.getSigma_x4() / l.getN());
        double e = b5 * (l.getSigma_x5() / l.getN());
        return y - a - b - c - d - e;
    }

    //The function cal the mse from the sample and equation For Vy
    private double calMseVy(List<RowInMap> map, Equation5 e) {
        double sum = 0;
        for(RowInMap tmp:map) {
            double x = tmp.getVy() - e.solve(tmp.getX(), tmp.getY(), tmp.getG(), tmp.getXx(), tmp.getVy());
            sum = sum + Math.pow(x,2);
        }
        return sum / (map.size()-2);
    }

    //The function cal the mse from the sample and equation For Vx
    private double calMseVx(List<RowInMap> map, Equation5 e) {
        double sum = 0;
        for(RowInMap tmp:map) {
            double x = tmp.getVx() - e.solve(tmp.getX(), tmp.getY(), tmp.getG(), tmp.getXx(), tmp.getVy());
            sum = sum + Math.pow(x,2);
        }
        return sum / (map.size()-2);
    }

    //The function get a satistic and create from him an linear equation
    protected LinearEquation5 evalEquationFromLinear(Linear5 linear) {
        MatrixHandler matrixHandler = new MatrixHandler();
        double[][] mat = createMatrix(linear);
        double[][] mat_inverse = matrixHandler.matrationInverse(mat,5);
        double b1 = calB(mat_inverse[0],linear);
        double b2 = calB(mat_inverse[1],linear);
        double b3 = calB(mat_inverse[2],linear);
        double b4 = calB(mat_inverse[3],linear);
        double b5 = calB(mat_inverse[4],linear);
        double b0 = calB0(linear,b1,b2,b3,b4,b5);
        return new LinearEquation5(b0,b1,b2,b3,b4,b5);
    }

    //The function calculate the satistics for Vx and then create the linear Equations for Vx
    @Override
    public Equation5 evalEquationVx(List<RowInMap> map) {
        Linear5 vx = new Linear5();
        for(RowInMap t:map) {
            LinearData5 tmpX = new LinearData5(t.getVx(), t.getX(), t.getY(), t.getG(), t.getXx(), t.getYy());
            vx.addData(tmpX);
        }
        LinearEquation5 e_vx = evalEquationFromLinear(vx);
        e_vx.setMse(calMseVx(map,e_vx));
        return e_vx;
    }

    @Override
    public Equation5 evalEquationVx(Equation5 old, List<RowInMap> map, double learnRate) {
        LinearEquation5 eq = (LinearEquation5)old; //This casting is ok because we called this function only with linar Regression
        double b0 =0;
        double b1 =0;
        double b2 =0;
        double b3 =0;
        double b4 =0;
        double b5 =0;
        for(RowInMap r:map) {
            b0 += -2 * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b1 += -2 * r.getX() * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b2 += -2 * r.getY() * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b3 += -2 * r.getG() * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b4 += -2 * r.getXx() * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b5 += -2 * r.getYy() * (r.getVx() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
        }
        /*System.out.println("Sums:");
        System.out.println(b0);
        System.out.println(b1);
        System.out.println(b2);
        System.out.println(b3);
        System.out.println(b4);
        System.out.println(b5);*/
        double nb0 = eq.getB0() - (b0 * learnRate);
        double nb1 = eq.getB1() - (b1 * learnRate);
        double nb2 = eq.getB2() - (b2 * learnRate);
        double nb3 = eq.getB3() - (b3 * learnRate);
        double nb4 = eq.getB4() - (b4 * learnRate);
        double nb5 = eq.getB5() - (b5 * learnRate);
        return new LinearEquation5(nb0, nb1, nb2, nb3, nb4, nb5);
    }

    //The function calculate the satistics for Vx and then create the linear Equations for Vx
    @Override
    public Equation5 evalEquationVy(List<RowInMap> map) {
        Linear5 vy = new Linear5();
        for(RowInMap t:map) {
            LinearData5 tmpY = new LinearData5(t.getVy(), t.getX(), t.getY(), t.getG(), t.getXx(), t.getYy());
            vy.addData(tmpY);
        }
        LinearEquation5 e_vy = evalEquationFromLinear(vy);
        e_vy.setMse(calMseVy(map,e_vy));
        return e_vy;
    }

    @Override
    public Equation5 evalEquationVy(Equation5 old, List<RowInMap> map, double learnRate) {
        LinearEquation5 eq = (LinearEquation5)old; //This casting is ok because we called this function only with linar Regression
        double b0 =0;
        double b1 =0;
        double b2 =0;
        double b3 =0;
        double b4 =0;
        double b5 =0;
        for(RowInMap r:map) {
            b0 += -2 * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b1 += -2 * r.getX() * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b2 += -2 * r.getY() * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b3 += -2 * r.getG() * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b4 += -2 * r.getXx() * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
            b5 += -2 * r.getYy() * (r.getVy() - eq.solve(r.getX(),r.getY(), r.getG(), r.getXx(), r.getYy()));
        }
        double nb0 = eq.getB0() - (b0 * learnRate);
        double nb1 = eq.getB1() - (b1 * learnRate);
        double nb2 = eq.getB2() - (b2 * learnRate);
        double nb3 = eq.getB3() - (b3 * learnRate);
        double nb4 = eq.getB4() - (b4 * learnRate);
        double nb5 = eq.getB5() - (b5 * learnRate);
        return new LinearEquation5(nb0, nb1, nb2, nb3, nb4, nb5);
    }

}
