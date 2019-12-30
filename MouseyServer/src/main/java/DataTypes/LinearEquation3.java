package DataTypes;

public class LinearEquation3 implements Equation3 {

    private String tag = "LinearEquation3";
    private double b0;
    private double b1;
    private double b2;
    private double b3;
    private double mse;

    public LinearEquation3(double b0, double b1, double b2, double b3) {
        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;
        mse = -99; //Defalt Value
        //TODO delete this
        String print = "Y = ";
        print += ""+b0+" +";
        print += ""+b1+" *x1 +";
        print += ""+b2+" *x2 +";
        print += ""+b3+" *x3";
        System.out.println(print);
    }

    @Override
    public double solve(double x1, double x2, double x3) {
        return b0 + b1*x1 + b2*x2 + b3*x3;
    }

    //Setters
    public void setMse(double mse) {
        this.mse = mse;
    }
}
