import javax.crypto.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.*;
import java.util.Base64;

public class Main {
    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, BadPaddingException, IllegalBlockSizeException {
        byte[] message;
        if(args.length > 0)
            message = readFile(new File(args[0]));
        else
            message = "No file given. Using this message.".getBytes();

        System.out.println(String.format("Original Message: \"%s\"", new String(message)));

        MacThenEncrypt.init();

        byte[] encrypted = MacThenEncrypt.encrypt(message);
        System.out.println(String.format("Encrypted Message: \"%s\"", new String(encrypted)));

        byte[] decrypted = MacThenEncrypt.decrypt(encrypted);
        if(decrypted != null) {
            System.out.println(String.format("Decrypted Message: \"%s\"", new String(decrypted)));
        }
        else {
            System.out.println("MAC did not match. Message was changed.");
        }
    }
    private static byte[] readFile(File file){
        FileInputStream fis = null;
        byte[] bArray = new byte[(int) file.length()];
        try{
            fis = new FileInputStream(file);
            fis.read(bArray);
            fis.close();

        }catch(IOException ioExp){
            ioExp.printStackTrace();
        }
        return bArray;
    }
}