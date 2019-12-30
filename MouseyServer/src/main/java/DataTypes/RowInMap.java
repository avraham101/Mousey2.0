package DataTypes;

public class RowInMap {
    //TODO need to transform this class from json that will be recived from the client
    private double vx;  // speed x
    private double vy;  // speed y
    private double x;   //accumolator x sensor data
    private double y;   //accumolator y sensor data
    private double g;   //gyroscpe z sensor data
    private double xx;  //acceleration x motion sensor data
    private double yy;  //acceleration y motion sensor data

    public RowInMap(double vx, double vy, double x, double y, double g, double xx, double yy) {
        this.vx = vx;
        this.vy = vy;
        this.x = x;
        this.y = y;
        this.g = g;
        this.xx = xx;
        this.yy = yy;
    }

    //private constructor for creating a copy
    private RowInMap(RowInMap other) {
        this.vx = other.vx;
        this.vy = other.vy;
        this.x = other.x;
        this.y = other.y;
        this.g = other.g;
        this.xx = other.xx;
        this.yy = other.yy;
    }

    //The function return a copy of the RowInMap
    public RowInMap copy() {
        return new RowInMap(this);
    }

    //Getters
    public double getVx() {
        return vx;
    }

    public double getVy() {
        return vy;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getG() {
        return g;
    }

    public double getXx() {
        return xx;
    }

    public double getYy() {
        return yy;
    }

}
