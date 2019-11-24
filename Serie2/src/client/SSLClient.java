package client;

import util.FileUtils;

import javax.net.ssl.*;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;

public class SSLClient {
    public static void main(String[] args) throws KeyStoreException, IOException, CertificateException, NoSuchAlgorithmException, UnrecoverableKeyException, KeyManagementException {
        //Load Alice key in keystore
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(new FileInputStream("/home/jpmatos/Documents/SI/repo/Serie2/src/client/Alice_1.pfx"), "changeit".toCharArray());

        //Create key manager
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("PKIX");
        keyManagerFactory.init(keyStore, "changeit".toCharArray());
        KeyManager[] km = keyManagerFactory.getKeyManagers();

        //Load root Certificate
        ByteArrayInputStream inputStream = new ByteArrayInputStream(FileUtils.readFile(new File("/home/jpmatos/Documents/SI/repo/Serie2/src/client/CA1.cer")));
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        Certificate certificate = certificateFactory.generateCertificate(inputStream);

        //Load root Certificate in keystore
        KeyStore keyStoreCert = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStoreCert.load(null);
        keyStoreCert.setCertificateEntry("1", certificate);

        //Create Trust Manager
        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance("PKIX");
        trustManagerFactory.init(keyStoreCert);
        TrustManager[] tm = trustManagerFactory.getTrustManagers();

        //Initialize SSLContext
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(km,  tm, null);

//        SSLSocket socket = (SSLSocket) sslContext.getSocketFactory().createSocket("www.isel.pt", 443);
        SSLSocket socket = (SSLSocket) sslContext.getSocketFactory().createSocket("www.secure-server.edu", 4433);


        // Mostrar certificado do servidor
        System.out.println(socket.getSession().getPeerCertificates()[0]);

        // mostrar esquemas criptográficos acordados
        System.out.println(socket.getSession().getCipherSuite());
    }
}
