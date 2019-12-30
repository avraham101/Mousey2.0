package DataTypes;

public class LinearEquation5 implements Equation5 {

    private String tag = "LinearEquation5";
    private double b0;
    private double b1;
    private double b2;
    private double b3;
    private double b4;
    private double b5;
    private double mse;

    public LinearEquation5(double b0, double b1, double b2, double b3, double b4, double b5) {
        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;
        this.b4 = b4;
        this.b5 = b5;
        mse = -99; //Defalt Value
        //TODO delete this
        String print = "Y = ";
        print += ""+b0+" +";
        print += ""+b1+" *x1 +";
        print += ""+b2+" *x2 +";
        print += ""+b3+" *x3 +";
        print += ""+b4+" *x4 +";
        print += ""+b5+" *x5 ";
        System.out.println(print);
    }

    @Override
    public double solve(double x1, double x2, double x3, double x4, double x5) {
        return b0 + b1*x1 + b2*x2 + b3*x3 + b4*x4 + b5*x5;
    }

    //Setters
    public void setMse(double mse) {
        this.mse = mse;
    }

    //Getters

    public double getB0() {
        return b0;
    }

    public double getB1() {
        return b1;
    }

    public double getB2() {
        return b2;
    }

    public double getB3() {
        return b3;
    }

    public double getB4() {
        return b4;
    }

    public double getB5() {
        return b5;
    }

}
