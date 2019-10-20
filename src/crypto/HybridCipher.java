package crypto;

import util.FileUtils;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;

public class HybridCipher {

    public static void cipher(File fileToCipher, File certFile, File fileDest, File metaDest) throws CertificateException, NoSuchAlgorithmException, InvalidKeyException, SignatureException, IOException, NoSuchPaddingException, BadPaddingException, IllegalBlockSizeException {
        //Generate symmetrical key
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        SecretKey k1 = keyGenerator.generateKey();

        //Cipher file with symmetrical key
        Cipher cipherAES = Cipher.getInstance("AES");
        cipherAES.init(Cipher.ENCRYPT_MODE, k1);
        byte[] cipheredFile = cipherAES.doFinal(FileUtils.readFile(fileToCipher));

        //Write ciphered file to new file
        FileUtils.writeToFIle(cipheredFile, fileDest.getAbsolutePath());

        //Sign symmetrical key (k1) with certificate's public key
        ByteArrayInputStream inputStream = new ByteArrayInputStream(FileUtils.readFile(certFile));
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        Certificate certificate = certificateFactory.generateCertificate(inputStream);
        PublicKey certPubKey = certificate.getPublicKey();

        Cipher cipherRSA = Cipher.getInstance("RSA");
        cipherRSA.init(Cipher.ENCRYPT_MODE, certPubKey);
        byte[] signedKey = cipherRSA.doFinal(k1.getEncoded());

        //Write signed symmetrical key (k1) to file
        FileUtils.writeToFIle(signedKey, metaDest.getAbsolutePath());
    }

    public static void decipher(File cipheredDataFile, File metadataFile, File certFile, String password, File destination) throws CertificateException, NoSuchAlgorithmException, KeyStoreException, NoSuchProviderException, IOException, NoSuchPaddingException, BadPaddingException, IllegalBlockSizeException, InvalidKeyException, UnrecoverableKeyException {
        //Load certificate's private key
        Key certPrivKey = FileUtils.readPfxKey(certFile, password);

        //Load metadata containing ciphered symmetrical key
        byte[] metadata = FileUtils.readFile(metadataFile);

        //Un-cipher symmetrical key with certificate's private key
        Cipher cipherRSA = Cipher.getInstance("RSA");
        cipherRSA.init(Cipher.DECRYPT_MODE, certPrivKey);
        byte[] symKeyEncoded = cipherRSA.doFinal(metadata);
        SecretKey symKey = new SecretKeySpec(symKeyEncoded, 0, symKeyEncoded.length, "AES");

        //Un-cipher file with symmetrical key
        byte[] cipheredFile = FileUtils.readFile(cipheredDataFile);
        Cipher cipherAES = Cipher.getInstance("AES");
        cipherAES.init(Cipher.DECRYPT_MODE, symKey);
        byte[] file = cipherAES.doFinal(cipheredFile);

        //Write un-ciphered file to destination
        FileUtils.writeToFIle(file, destination.getAbsolutePath());
    }
}
