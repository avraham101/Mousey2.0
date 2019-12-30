package DataTypes;

//The same as the shell Data
public class Linear3 {

    private int n;
    private double sigma_x1;
    private double sigma_x2;
    private double sigma_x3;
    private double sigma_y;
    private double sigma_x1x1;
    private double sigma_x1x2;
    private double sigma_x1x3;
    private double sigma_x2x2;
    private double sigma_x2x3;
    private double sigma_x3x3;
    private double sigma_x1y;
    private double sigma_x2y;
    private double sigma_x3y;

    public Linear3() {
        this.n = 0;
        this.sigma_x1 = 0;
        this.sigma_x2 = 0;
        this.sigma_x3 = 0;
        this.sigma_y = 0;
        this.sigma_x1x1 = 0;
        this.sigma_x1x2 = 0;
        this.sigma_x1x3 = 0;
        this.sigma_x2x2 = 0;
        this.sigma_x2x3 = 0;
        this.sigma_x3x3 = 0;
        this.sigma_x1y = 0;
        this.sigma_x2y = 0;
        this.sigma_x3y = 0;
    }

    public void addData(LinearData3 ld) {
        this.n++;
        this.sigma_x1 += ld.getX1();
        this.sigma_x2 += ld.getX2();
        this.sigma_x3 += ld.getX3();
        this.sigma_y += ld.getY();
        this.sigma_x1x1 += ld.getX1() * ld.getX1();
        this.sigma_x1x2 += ld.getX1() * ld.getX2();
        this.sigma_x1x3 += ld.getX1() * ld.getX3();
        this.sigma_x2x2 += ld.getX2() * ld.getX2();
        this.sigma_x2x3 += ld.getX2() * ld.getX3();
        this.sigma_x3x3 += ld.getX3() * ld.getX3();
        this.sigma_x1y += ld.getY() * ld.getX1();
        this.sigma_x2y += ld.getY() * ld.getX2();
        this.sigma_x3y += ld.getY() * ld.getX3();
    }

    //Getters

    public double getSigma_x1() {
        return sigma_x1;
    }

    public double getSigma_x2() {
        return sigma_x2;
    }

    public double getSigma_x3() {
        return sigma_x3;
    }

    public double getSigma_y() {
        return sigma_y;
    }

    public double getSigma_x1x1() {
        return sigma_x1x1;
    }

    public double getSigma_x1x2() {
        return sigma_x1x2;
    }

    public double getSigma_x1x3() {
        return sigma_x1x3;
    }

    public double getSigma_x2x2() {
        return sigma_x2x2;
    }

    public double getSigma_x2x3() {
        return sigma_x2x3;
    }

    public double getSigma_x3x3() {
        return sigma_x3x3;
    }

    public double getSigma_x1y() {
        return sigma_x1y;
    }

    public double getSigma_x2y() {
        return sigma_x2y;
    }

    public double getSigma_x3y() {
        return sigma_x3y;
    }

    public int getN() {
        return n;
    }
}
