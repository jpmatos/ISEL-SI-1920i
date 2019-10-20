import crypto.MacThenEncrypt;
import util.FileUtils;

import javax.crypto.*;
import java.io.File;
import java.security.*;

public class Ex8 {
    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, BadPaddingException, IllegalBlockSizeException {
        byte[] message;
        if(args.length > 0)
            message = FileUtils.readFile(new File(args[0]));
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
}