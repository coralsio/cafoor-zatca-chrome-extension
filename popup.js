function updateVat() {
  const amt = Math.max(0, Number(document.getElementById("amt").value) || 0);
  const rate = Math.max(0, Number(document.getElementById("rate").value) || 0) / 100;
  const vatAdd = amt * rate;
  const gross = amt + vatAdd;
  const netEx = amt / (1 + rate);
  const vatEx = amt - netEx;
  document.getElementById("vatOut").innerHTML =
    `+VAT: Net ${amt.toFixed(2)} + VAT ${vatAdd.toFixed(2)} = <b>${gross.toFixed(2)}</b><br/>` +
    `Incl: Net ${netEx.toFixed(2)} + VAT ${vatEx.toFixed(2)} = <b>${amt.toFixed(2)}</b>`;
}

function decodeTlv() {
  const raw = (document.getElementById("tlv").value || "").trim();
  const box = document.getElementById("tlvOut");
  if (!raw) { box.style.display = "none"; return; }
  try {
    const bin = atob(raw);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const td = new TextDecoder("utf-8", { fatal: false });
    const names = { 1: "Seller", 2: "VAT No", 3: "Time", 4: "Total", 5: "VAT" };
    const rows = [];
    for (let i = 0; i < bytes.length; ) {
      const tag = bytes[i++];
      if (i >= bytes.length) break;
      const len = bytes[i++];
      const val = td.decode(bytes.subarray(i, i + len));
      i += len;
      rows.push(`T${tag} (${names[tag] || "Tag"}): ${val.replace(/</g, "&lt;")}`);
    }
    box.style.display = "block";
    box.innerHTML = rows.join("<br/>") || "Empty TLV";
  } catch {
    box.style.display = "block";
    box.textContent = "Invalid Base64 TLV string";
  }
}

document.getElementById("amt").addEventListener("input", updateVat);
document.getElementById("rate").addEventListener("change", updateVat);
document.getElementById("tlv").addEventListener("input", decodeTlv);
updateVat();
