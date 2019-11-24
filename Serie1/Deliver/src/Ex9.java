import crypto.HybridCipher;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.File;
import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class Ex9 {
    public static void main(String[] arguments) {
        List<String> args = Arrays.asList(arguments);

        if(args.size() == 0 || args.contains("-h")){
            printHelpText();
            return;
        }

        String mode;
        if(args.contains("-m")){
            mode = args.get(args.indexOf("-m") + 1);
        }
        else {
            System.out.println("Missing mode!");
            return;
        }

        String file;
        if (args.contains("-f")){
            file = args.get(args.indexOf("-f") + 1);
        }
        else {
            System.out.println("Missing file to cipher/decipher!");
            return;
        }

        String fileDest;
        if (args.contains("-fd")){
            fileDest = args.get(args.indexOf("-fd") + 1);
        }
        else {
            fileDest = file + ".out";
        }

        String certificate;
        if(args.contains("-c")){
            certificate = args.get(args.indexOf("-c") + 1);
        }
        else{
            System.out.println("Missing certificate file!");
            return;
        }

        String key;
        if(args.contains("-k")){
            key = args.get(args.indexOf("-k") + 1);
        }
        else {
            System.out.println("Missing key metadata file!");
            return;
        }

        String password;
        if (args.contains("-p")){
            password = args.get(args.indexOf("-p") + 1);
        }
        else {
            password = "";
        }

        switch (mode){
            case "cipher":
                cipher(file, fileDest, certificate, key);
                break;
            case "decipher":
                decipher(file, fileDest, certificate, key, password);
                break;
            default:
                System.out.println("Unknown mode: '" + mode + "'.");
        }
    }

    private static void decipher(String file, String fileDest, String certificate, String key, String password) {
        File fileFile = new File(file);
        if(!verifyExistingFile(fileFile))
            return;

        File fileDestFile = new File(fileDest);
        if(!verifyNewFile(fileDestFile))
            return;

        File certificateFile = new File(certificate);
        if(!verifyExistingFile(certificateFile))
            return;

        File keyFile = new File(key);
        if(!verifyExistingFile(keyFile))
            return;

        try {
            HybridCipher.decipher(fileFile, keyFile, certificateFile, password, fileDestFile);
        } catch (CertificateException | NoSuchAlgorithmException | KeyStoreException | NoSuchProviderException | IOException | NoSuchPaddingException | BadPaddingException | IllegalBlockSizeException | InvalidKeyException | UnrecoverableKeyException e) {
            System.out.println("Failed decipher operation.");
            e.printStackTrace();
        }
    }

    private static void cipher(String file, String fileDest, String certificate, String key) {
        File fileFile = new File(file);
        if(!verifyExistingFile(fileFile))
            return;

        File fileDestFile = new File(fileDest);
        if(!verifyNewFile(fileDestFile))
            return;

        File certificateFile = new File(certificate);
        if(!verifyExistingFile(certificateFile))
            return;

        File keyFile = new File(key);
        if(!verifyNewFile(keyFile))
            return;

        try {
            HybridCipher.cipher(fileFile, certificateFile, fileDestFile, keyFile);
        }
        catch (CertificateException | NoSuchAlgorithmException | InvalidKeyException | SignatureException | IOException | NoSuchPaddingException | BadPaddingException | IllegalBlockSizeException e) {
            System.out.println("Failed cipher operation.");
            e.printStackTrace();
        }

    }

    private static boolean verifyNewFile(File fileDestFile) {
        if(fileDestFile.exists())
        {
            System.out.println("File '" + fileDestFile.getAbsolutePath() + "' already exists! Overwrite? y/n");
            Scanner scanner = new Scanner(System.in);
            String confirm = scanner.nextLine();
            if(confirm.equals("y")){
                fileDestFile.delete();
            }
            else {
                System.out.println("Did not delete already existing file. Aborting...");
                return false;
            }
        }
        return true;
    }

    private static boolean verifyExistingFile(File fileFile){
        if(!fileFile.exists()){
            System.out.println("Can not find file: '" + fileFile.getAbsolutePath() + "'!");
            return false;
        }
        return true;
    }

    private static void printHelpText() {
        System.out.println(
                        "[-h] Prints this text.\n" +
                        "[-m] [:mode] Choose which mode. Options are 'cipher' and 'decipher'\n" +
                        "[-f] [:path] Specifies file path. Reads in cipher mode and writes in decipher mode.\n" +
                        "[-fd] [:path] Specifies new file path. Will use same path as file if not specified.\n" +
                        "[-c] [:path] Specifies certificate path. Expects a .cer file in cipher mode and a .pfx file in decipher mode.\n" +
                        "[-k] [:path] Specifies key metadata path. Reads in cipher mode and writes in decipher mode.\n" +
                        "[-p] [:password] The password to read the .pfx file. Empty if not specified.");
    }
}
