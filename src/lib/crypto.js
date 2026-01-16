// // lib/crypto.js

// export const generateSharedKey = async () => {
//   return await window.crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true, 
//     ["encrypt", "decrypt"]
//   );
// };

// export const encryptData = async (text, key) => {
//   const encoder = new TextEncoder();
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));
//   const encrypted = await window.crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     key,
//     encoder.encode(text)
//   );

//   return {
//     cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
//     iv: btoa(String.fromCharCode(...iv)),
//   };
// };

// export const decryptData = async (packet, key) => {
//   const decoder = new TextDecoder();
//   const { cipherText, iv } = packet;
//   const encryptedData = new Uint8Array(atob(cipherText).split("").map(c => c.charCodeAt(0)));
//   const ivData = new Uint8Array(atob(iv).split("").map(c => c.charCodeAt(0)));

//   const decrypted = await window.crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: ivData },
//     key,
//     encryptedData
//   );
//   return decoder.decode(decrypted);
// };

// export const exportKey = async (key) => await window.crypto.subtle.exportKey("jwk", key);

// export const importKey = async (jwk) => await window.crypto.subtle.importKey(
//   "jwk", jwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]
// );


// lib/crypto.js
export const generateSharedKey = async () => {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const exportKey = async (key) => await window.crypto.subtle.exportKey("jwk", key);
export const importKey = async (jwk) => await window.crypto.subtle.importKey(
  "jwk", jwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]
);

export const encryptData = async (text, key) => {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
  return {
    cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
};

export const decryptData = async (packet, key) => {
  const { cipherText, iv } = packet;
  const encryptedData = new Uint8Array(atob(cipherText).split("").map(c => c.charCodeAt(0)));
  const ivData = new Uint8Array(atob(iv).split("").map(c => c.charCodeAt(0)));
  const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: ivData }, key, encryptedData);
  return new TextDecoder().decode(decrypted);
};

export const encryptFile = async (fileBuffer, key) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, fileBuffer);
  return { encryptedBuffer: encrypted, iv };
};

export const decryptFile = async (buffer, iv, key) => {
  return await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, buffer);
};