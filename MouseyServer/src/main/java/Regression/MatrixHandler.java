package Regression;//The Class handels matrix
//Functions matrix^-1, and matrix Rating

public class MatrixHandler {

    //The function copy a row from and return the new row
    //note: deep copy
    private double[] copyRow(double[] arr) {
        if(arr==null)
            return null;
        double[] copy = new double[arr.length];
        for(int i=0;i<arr.length;i++)
            copy[i] = arr[i];
        return copy;
    }

    //The function return The unit matrix n*n
    private double[][] createUnitMatrix(int n){
        double[][] out = new  double[n][];
        for(int i=0; i<n; i++) {
            out[i] = new double[n];
            for(int j=0;j<n; j++){
                if(i==j)
                    out[i][j] = 1;
                else
                    out[i][j] = 0;
            }
        }
        return out;
    }

    //The function find the pivot column j, starting row i to the max i (n)
    //pre-conditions: the matrix must be n*n
    //post-coditions: return number between 0 to n
    private int findPivot(double[][] matrix,int j,int i,int n){
        int max_i = 0;
        for(int t= i; t<n; t++) {
            if( matrix[t][j] != 0)
                max_i = t;
        }
        return max_i;
    }

    //The function swap rows i,j in Matrix
    //post-coditions: create a mutation of the matrix
    private void swapRowsInMatrix(double[][] matrix,int i,int j) {
        double[] copy_row_i = copyRow(matrix[i]);
        matrix[i] = copyRow(matrix[j]);
        matrix[j] = copy_row_i;
    }

    //The function divide a row i in the Matrix by value
    //post-coditions: create a mutation of the matrix
    private void divideRowInMatrix(double[][] matrix,int n,int i,double val) {
        for(int k= 0; k<n; k++)
        matrix[i][k] = matrix[i][k] / val;
    }

    //The function mul a row i by value
    //post-coditions: create a mutation of the row
    private void mulRow (double[] row, int n, double val) {
        for(int k= 0; k<n; k++)
        row[k] = row[k] * val;
    }

    //The function substract between row i and row j
    //pre-coditions: the two rows must be in the same size n. substract row_i[k]- row_j[k]
    //post-coditions: create a mutation of the row i
    private void subRowToRow(double[] row_i, double[] row_j, int n) {
        for(int k= 0; k<n; k++)
        row_i[k] = row_i[k] - row_j[k];
    }

    //The function return the matrix rating
    //pre-conditions: Matrix must be n*n
    //post-conditions: the new Matrix is n*n
    private void matrationRating(double[][] matrix, int n){
        int i= 0;
        int j= 0;
        int max_i= 0;
        do {
            //1) find the pivot column j, starting row i
            max_i = findPivot(matrix,j,i,n);
            //2) run on all the other rows and act to find the greater pivot
            for(int k= i; k<n; k++) {
                //2.1) find the greater pivot value to be max_i
                if( Math.abs(matrix[k][j]) > Math.abs(matrix[max_i][j]))
                    max_i = k;
            }
            if(matrix[max_i][j]!=0) {  //(if didnt find fo to the next column)
                //3.1) swap between rows i and max_i
                swapRowsInMatrix(matrix,i,max_i);
                //3.2) divide each entry of row i by A[i][j]
                divideRowInMatrix(matrix,n,i,matrix[i][j]);
                //3.3) for each row start i+1
                for(int u= i+1; u<n; u++) {
                    double mul= matrix[u][j];
                    double[] row_i = copyRow(matrix[i]);
                    //3.3.1) mul each value at row_i (A[u][j]* row_i)
                    mulRow(row_i,n,mul);
                    //3.3.2) substract each value at row_i from row u
                    subRowToRow(matrix[u],row_i,n);
                }
                //3.4) go to the next row
                i = i+1;
            }
            //4) go to the next column
            j = j+1;
        }while(i<n && j<n);
    }

    //The function return the Inverse matrix
    //pre-conditions: Matrix must be n*n
    //post-conditions: the new Matrix is n*n
    public double[][] matrationInverse(double[][] mat,int n){
        double[][] out = createUnitMatrix(n);
        int i= 0;
        int j= 0;
        int max_i= 0;
        do {
            //1) find the pivot column j, starting row i
            max_i = findPivot(mat,j,i,n);
            //2) run on all the other rows and act to find the greater pivot
            for(int k = i; k<n; k++) {
                //2.1) find the greater pivot value to be max_i
                if( Math.abs(mat[k][j]) > Math.abs(mat[max_i][j]))
                    max_i = k;
            }
            if(mat[max_i][j]!=0) {  //(if didnt find fo to the next column)
                //3.1) swap between rows i and max_i
                swapRowsInMatrix(mat,i,max_i);
                swapRowsInMatrix(out,i,max_i);
                //3.2) divide each entry of row i by A[i][j]
                divideRowInMatrix(mat,n,i,mat[i][j]);
                divideRowInMatrix(out,n,i,mat[i][j]);
                //3.3) for each row start i+1
                for(int u= i+1; u<n; u++) {
                    double mul= mat[u][j];
                    double[] row_i = copyRow(mat[i]);
                    double[] out_row_i = copyRow(out[i]);
                    //3.3.1) mul each value at row_i (A[u][j]* row_i)
                    mulRow(row_i,n,mul);
                    mulRow(out_row_i,n,mul);
                    //3.3.2) substract each value at row_i from row u
                    subRowToRow(mat[u],row_i,n);
                    subRowToRow(out[u],out_row_i,n);
                }
                //3.4) go to the next row
                i = i+1;
            }
            //4) go to the next column
            j = j+1;
        }while(i<n && j<n);
        return out;
    }

}
