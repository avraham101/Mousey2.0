package Presestent;

import DataTypes.RowInMap;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Scanner;

public class ExecelKeeper {

    private String path;

    public void saveGeneration(int n,List<RowInMap> data) {
        path = "Analyze/Generation"+n+".csv";
        File out = new File(path);
        try {
            if (out.createNewFile()) {
                FileWriter fr = new FileWriter(out);
                BufferedWriter buffer = new BufferedWriter(fr);
                buffer.write(getHead());
                for(RowInMap tmp:data) {
                    buffer.write(transfor(tmp));
                }
                buffer.close();
                System.out.println("Saved Generation "+n+" in Excel at "+out.getAbsolutePath());
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getHead() {
        String out = "";
        out += "Vx,";
        out += "Vy,";
        out += "X,";
        out += "Y,";
        out += "G,";
        out += "Xx,";
        out += "Yy\n";
        return out;
    }

    private String transfor(RowInMap a) {
        String out = "";
        out +=a.getVx()+",";
        out +=a.getVy()+",";
        out += a.getX()+",";
        out += a.getY()+",";
        out += a.getG()+",";
        out += a.getXx()+",";
        out += a.getYy()+"\n";
        return out;
    }
}
