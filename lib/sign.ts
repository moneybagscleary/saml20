import xmlcrypto from 'xml-crypto';
import { PubKeyInfo } from './cert';

const issuerXPath = '/*[local-name(.)="Issuer" and namespace-uri(.)="urn:oasis:names:tc:SAML:2.0:assertion"]';

const sign = (xml: string, signingKey: string, publicKey: string, xPath: string) => {
  if (!xml) {
    throw new Error('Please specify xml');
  }
  if (!signingKey) {
    throw new Error('Please specify signingKey');
  }

  const sig = new xmlcrypto.SignedXml();
  sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
  sig.keyInfoProvider = new PubKeyInfo(publicKey);
  sig.signingKey = signingKey;
  sig.addReference(
    xPath,
    ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#'],
    'http://www.w3.org/2001/04/xmlenc#sha256'
  );
  sig.computeSignature(xml, {
    location: { reference: xPath + issuerXPath, action: 'after' },
  });

  return sig.getSignedXml();
};

export { sign };
