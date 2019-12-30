package DataTypes;

public class PolmiyalEquation5 implements Equation5 {

    private String tag = "PolmiyalEquation5";
    private Equation3 ex;
    private Equation3 ey;
    private Equation3 eg;
    private Equation3 exx;
    private Equation3 eyy;
    private Equation5 multi;

    public PolmiyalEquation5(Equation3 ex, Equation3 ey, Equation3 eg, Equation3 exx, Equation3 eyy, Equation5 multi) {
        this.ex = ex;
        this.ey = ey;
        this.eg = eg;
        this.exx = exx;
        this.eyy = eyy;
        this.multi = multi;
    }

    //The function create the LinearData3 for (y,x,x^2,x^3)
    private LinearData3 evalData(double y,double x) {
        double x2 = Math.pow(x,2);
        double x3 = Math.pow(x,3);
        return new LinearData3(y,x, x2,x3);
    }

    private double solveEq3(Data3 data, Equation3 eq) {
        return eq.solve(data.x1, data.x2, data.x3);
    }

    @Override
    public double solve(double x1, double x2, double x3, double x4, double x5) {
        double y1 = solveEq3(new Data3(x1), ex);
        double y2 = solveEq3(new Data3(x2), ey);
        double y3 = solveEq3(new Data3(x3), eg);
        double y4 = solveEq3(new Data3(x4), exx);
        double y5 = solveEq3(new Data3(x5), eyy);
        return multi.solve(y1,y2,y3,y4,y5);
    }

    //inner class for representing a data3
    private class Data3 {

        double x1;
        double x2;
        double x3;

        public Data3(double x) {
            this.x1 = x;
            this.x2 = Math.pow(x,2);
            this.x3 = Math.pow(x,3);
        }
    }
}
