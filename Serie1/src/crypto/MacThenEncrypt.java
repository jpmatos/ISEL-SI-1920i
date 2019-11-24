package crypto;

import javax.crypto.*;
import java.security.*;
import java.util.Arrays;

public class MacThenEncrypt {

    private static Key k1;
    private static Key k2;

    public static void init() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        k1 = keyGenerator.generateKey();
        k2 = keyGenerator.generateKey();
    }

    public static byte[] encrypt(byte[] message) throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, BadPaddingException, IllegalBlockSizeException {
        //generate MAC mark
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(k1);
        byte[] messageMark = mac.doFinal(message);

        //concat with message
        byte[] messageConcatMark = new byte[message.length + messageMark.length];
        System.arraycopy(message, 0, messageConcatMark, 0, message.length);
        System.arraycopy(messageMark, 0, messageConcatMark, message.length, messageMark.length);

        //cipher concat message
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, k2);
        byte[] res = cipher.doFinal(messageConcatMark);

        return res;
    }

    public static byte[] decrypt(byte[] message) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        //Decipher message
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, k2);
        byte[] messageDecipher = cipher.doFinal(message);

        //Separate message from mark
        byte[] messageOriginal = new byte[messageDecipher.length - 32];
        byte[] mark = new byte[32];
        System.arraycopy(messageDecipher, 0, messageOriginal, 0, messageOriginal.length);
        System.arraycopy(messageDecipher, messageOriginal.length, mark, 0, mark.length);

        //Verify mark against original message
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(k1);
        byte[] messageMark = mac.doFinal(messageOriginal);
        boolean areEqual = Arrays.equals(messageMark, mark);

        //Return original message if MAC mark matches, return null if not
        if(areEqual)
            return messageOriginal;
        else
            return null;
    }
}
