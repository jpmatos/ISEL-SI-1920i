package util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.Enumeration;
import java.util.Scanner;

public class FileUtils {
    public static byte[] readFile(File file){
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

    public static Key readPfxKey(File certFile, String password) throws CertificateException, NoSuchAlgorithmException, IOException, NoSuchProviderException, KeyStoreException, UnrecoverableKeyException {
        try (FileInputStream stream = new FileInputStream(certFile)) {
            KeyStore store = KeyStore.getInstance("pkcs12", "SunJSSE");
            store.load(stream, password.toCharArray());
            String alias = store.aliases().nextElement();

            return store.getKey(alias, password.toCharArray());
        }
    }

    public static void writeToFIle(byte[] file, String destination) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(destination)) {
            fos.write(file);
        }
    }
}
