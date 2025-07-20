import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

import os
import numpy as np

# 1. Fuzzifikasi (contoh untuk GPA, nilai dummy)
def fuzzify_gpa(gpa):
    # Segitiga/trapesium:
    # Low: segitiga (1.8, 2.0, 2.2)
    # Medium: trapesium (2.0, 2.2, 3.0, 3.2)
    # High: segitiga (3.0, 3.2, 4.0)
    def low(x):
        if x <= 1.8:
            return 1
        elif 1.8 < x < 2.0:
            return (2.0 - x) / (2.0 - 1.8)
        elif 2.0 <= x <= 2.2:
            return (2.2 - x) / (2.2 - 2.0)
        else:
            return 0

    def medium(x):
        if 2.0 < x < 2.2:
            return (x - 2.0) / (2.2 - 2.0)
        elif 2.2 <= x <= 3.0:
            return 1
        elif 3.0 < x < 3.2:
            return (3.2 - x) / (3.2 - 3.0)
        else:
            return 0

    def high(x):
        if 3.0 < x < 3.2:
            return (x - 3.0) / (3.2 - 3.0)
        elif 3.2 <= x <= 4.0:
            return 1
        else:
            return 0

    return {
        "Low": low(gpa),
        "Medium": medium(gpa),
        "High": high(gpa)
    }

# 2. Contoh input dummy
inputs = {
    "GPA": 2.15,           # Akan menghasilkan Low dan Medium
    "CCA": 68,             # Akan menghasilkan Medium dan High
    "Attendance": 0.82,    # Akan menghasilkan Medium dan High
    "Midterm": 78,         # Akan menghasilkan Medium dan High
    "FinalExam": 85        # Akan menghasilkan High
}

# 3. Fuzzifikasi semua variabel (pakai rumus segitiga/trapesium sederhana)
def fuzzify_cca(cca):
    # Low: segitiga (0, 50, 60)
    # Medium: trapesium (55, 65, 75, 85)
    # High: segitiga (75, 85, 100)
    def low(x):
        if x <= 50:
            return 1
        elif 50 < x < 60:
            return (60 - x) / (60 - 50)
        else:
            return 0

    def medium(x):
        if 55 < x < 65:
            return (x - 55) / (65 - 55)
        elif 65 <= x <= 75:
            return 1
        elif 75 < x < 85:
            return (85 - x) / (85 - 75)
        else:
            return 0

    def high(x):
        if 75 < x < 85:
            return (x - 75) / (85 - 75)
        elif 85 <= x <= 100:
            return 1
        else:
            return 0

    return {
        "Low": low(cca),
        "Medium": medium(cca),
        "High": high(cca)
    }

def fuzzify_attendance(att):
    # Low: segitiga (0, 0.6, 0.7)
    # Medium: trapesium (0.65, 0.75, 0.85, 0.9)
    # High: segitiga (0.85, 0.9, 1)
    def low(x):
        if x <= 0.6:
            return 1
        elif 0.6 < x < 0.7:
            return (0.7 - x) / (0.7 - 0.6)
        else:
            return 0

    def medium(x):
        if 0.65 < x < 0.75:
            return (x - 0.65) / (0.75 - 0.65)
        elif 0.75 <= x <= 0.85:
            return 1
        elif 0.85 < x < 0.9:
            return (0.9 - x) / (0.9 - 0.85)
        else:
            return 0

    def high(x):
        if 0.85 < x < 0.9:
            return (x - 0.85) / (0.9 - 0.85)
        elif 0.9 <= x <= 1:
            return 1
        else:
            return 0

    return {
        "Low": low(att),
        "Medium": medium(att),
        "High": high(att)
    }

def fuzzify_midterm(mid):
    # Low: segitiga (0, 55, 65)
    # Medium: trapesium (60, 70, 80, 90)
    # High: segitiga (80, 90, 100)
    def low(x):
        if x <= 55:
            return 1
        elif 55 < x < 65:
            return (65 - x) / (65 - 55)
        else:
            return 0

    def medium(x):
        if 60 < x < 70:
            return (x - 60) / (70 - 60)
        elif 70 <= x <= 80:
            return 1
        elif 80 < x < 90:
            return (90 - x) / (90 - 80)
        else:
            return 0

    def high(x):
        if 80 < x < 90:
            return (x - 80) / (90 - 80)
        elif 90 <= x <= 100:
            return 1
        else:
            return 0

    return {
        "Low": low(mid),
        "Medium": medium(mid),
        "High": high(mid)
    }

def fuzzify_final(final):
    # Low: segitiga (0, 54, 65)
    # Medium: trapesium (60, 70, 80, 90)
    # High: segitiga (80, 90, 100)
    def low(x):
        if x <= 54:
            return 1
        elif 54 < x < 65:
            return (65 - x) / (65 - 54)
        else:
            return 0

    def medium(x):
        if 60 < x < 70:
            return (x - 60) / (70 - 60)
        elif 70 <= x <= 80:
            return 1
        elif 80 < x < 90:
            return (90 - x) / (90 - 80)
        else:
            return 0

    def high(x):
        if 80 < x < 90:
            return (x - 80) / (90 - 80)
        elif 90 <= x <= 100:
            return 1
        else:
            return 0

    return {
        "Low": low(final),
        "Medium": medium(final),
        "High": high(final)
    }

# Fuzzifikasi semua input
fuzzy_gpa = fuzzify_gpa(inputs["GPA"])
fuzzy_cca = fuzzify_cca(inputs["CCA"])
fuzzy_att = fuzzify_attendance(inputs["Attendance"])
fuzzy_mid = fuzzify_midterm(inputs["Midterm"])
fuzzy_final = fuzzify_final(inputs["FinalExam"])

print("=== FUZZIFIKASI ===")
print("GPA:", fuzzy_gpa)
print("CCA:", fuzzy_cca)
print("Attendance:", fuzzy_att)
print("Midterm:", fuzzy_mid)
print("FinalExam:", fuzzy_final)
print()

# 4. Rule Inferensi (contoh 5 rule, predikat tetap 5)
rules = [
    # (GPA, CCA, Attendance, Midterm, FinalExam, Output)
    ("Low", "Low", "Low", "Low", "Low", "Poor"),
    ("Medium", "Medium", "Medium", "Medium", "Medium", "Satisfactory"),
    ("High", "High", "High", "High", "High", "Excellent"),
    ("Medium", "High", "Medium", "High", "High", "Good"),
    ("Low", "Medium", "Low", "Medium", "Medium", "Needs Improvement"),
]

# Fungsi invers keanggotaan output (monoton, range 1-5)
def inv_poor(alpha):
    # Monoton turun dari 1 (α=1) ke 0 (α=0) pada z=1..2
    # μ(z) = (2-z)/(2-1) => z = 2 - α*(2-1) = 2 - α
    return 2 - alpha

def inv_needs_improvement(alpha):
    # Monoton turun dari 2 (α=1) ke 0 (α=0) pada z=2..3
    return 3 - alpha

def inv_satisfactory(alpha):
    # Monoton turun dari 3 (α=1) ke 0 (α=0) pada z=3..4
    return 4 - alpha

def inv_good(alpha):
    # Monoton naik dari 0 (α=0) ke 1 (α=1) pada z=4..5
    # μ(z) = (z-4)/(5-4) => z = 4 + α*(5-4) = 4 + α
    return 4 + alpha

def inv_excellent(alpha):
    # Monoton naik dari 0 (α=0) ke 1 (α=1) pada z=5..6 (atau tetap 5..5.99)
    return 5 + alpha

output_inv_funcs = {
    "Poor": inv_poor,
    "Needs Improvement": inv_needs_improvement,
    "Satisfactory": inv_satisfactory,
    "Good": inv_good,
    "Excellent": inv_excellent,
}

# Fungsi untuk mengambil membership dari dictionary fuzzy
def get_membership(fuzzy, label):
    return fuzzy[label]

# 5. Hitung firing strength tiap rule (R1, R2, ...) dan output crisp z_i
firing_strengths = []
zs = []
for idx, rule in enumerate(rules):
    gpa_label, cca_label, att_label, mid_label, fin_label, output = rule
    mu_gpa = get_membership(fuzzy_gpa, gpa_label)
    mu_cca = get_membership(fuzzy_cca, cca_label)
    mu_att = get_membership(fuzzy_att, att_label)
    mu_mid = get_membership(fuzzy_mid, mid_label)
    mu_fin = get_membership(fuzzy_final, fin_label)
    alpha = min(mu_gpa, mu_cca, mu_att, mu_mid, mu_fin)
    if alpha > 0:
        z = output_inv_funcs[output](alpha)
        zs.append((alpha, z, output))
    firing_strengths.append((f"R{idx+1}", alpha, output))
    print(f"R{idx+1}: min({mu_gpa:.3f}, {mu_cca:.3f}, {mu_att:.3f}, {mu_mid:.3f}, {mu_fin:.3f}) = {alpha:.3f} => {output}" + (f", z={z:.3f}" if alpha > 0 else ""))

print()

# 6. Tidak perlu agregasi output fuzzy pada Tsukamoto

# 7. Defuzzifikasi Tsukamoto
if zs:
    sum_num = sum(alpha * z for alpha, z, _ in zs)
    sum_den = sum(alpha for alpha, _, _ in zs)
    defuzz_value = sum_num / sum_den if sum_den > 0 else 0
else:
    defuzz_value = 0

print("=== DEFUZZIFIKASI (TSUKAMOTO) ===")
print("Rumus: (Σ (α_i * z_i)) / (Σ α_i)")
for alpha, z, output in zs:
    print(f"{output}: α={alpha:.3f}, z={z:.3f}, α*z={alpha*z:.3f}")
print(f"Defuzzification value = {sum_num:.3f} / {sum_den:.3f} = {defuzz_value:.3f}")
print()

# 8. Visualisasi membership function (contoh GPA)
x = np.linspace(1.5, 4.0, 100)
y_low = [fuzzify_gpa(xi)["Low"] for xi in x]
y_med = [fuzzify_gpa(xi)["Medium"] for xi in x]
y_high = [fuzzify_gpa(xi)["High"] for xi in x]
plt.plot(x, y_low, label="Low")
plt.plot(x, y_med, label="Medium")
plt.plot(x, y_high, label="High")
plt.title("Fungsi Keanggotaan GPA")
plt.xlabel("GPA")
plt.ylabel("Membership")
plt.legend()
plt.grid(True)
plt.tight_layout()
img_path = "gpa_membership.png"
plt.savefig(img_path)
plt.close()

# 9. Gambar rumus segitiga dan trapesium (dalam komentar)
"""
Rumus segitiga:
      /\
     /  \
----/----\----
  a  b   c

μ(x) = (x-a)/(b-a) jika a <= x < b
μ(x) = (c-x)/(c-b) jika b <= x <= c
μ(x) = 0 selain itu

Rumus trapesium:
      ______
     /      \
----/--------\----
  a  b      c  d

μ(x) = (x-a)/(b-a) jika a <= x < b
μ(x) = 1 jika b <= x <= c
μ(x) = (d-x)/(d-c) jika c < x <= d
μ(x) = 0 selain itu
"""

# 10. Output akhir
if zs:
    # Pilih kategori terdekat dari defuzz_value
    pred_idx = int(round(defuzz_value))
    pred_idx = max(1, min(5, pred_idx))
    pred_map = {1: "Poor", 2: "Needs Improvement", 3: "Satisfactory", 4: "Good", 5: "Excellent"}
    pred_label = pred_map[pred_idx]
else:
    pred_label = "Tidak ada rule aktif"

print("=== HASIL AKHIR (TSUKAMOTO) ===")
print(f"Kategori prediksi: {pred_label}")
print(f"Nilai defuzzifikasi: {defuzz_value:.3f}")

# 11. Simpan hasil ke PDF (tambahkan rumus tsukamoto)
def save_to_pdf():
    pdf_path = "fuzzy_manual_result.pdf"
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4
    y = height - 2*cm

    c.setFont("Helvetica-Bold", 16)
    c.drawString(2*cm, y, "Manual Fuzzy Calculation Example")
    y -= 1.2*cm

    c.setFont("Helvetica", 11)
    c.drawString(2*cm, y, "1. Input Values:")
    y -= 0.7*cm
    for k, v in inputs.items():
        c.drawString(2.5*cm, y, f"{k}: {v}")
        y -= 0.5*cm

    y -= 0.2*cm
    c.drawString(2*cm, y, "2. Fuzzification Results:")
    y -= 0.7*cm
    for var, fuzzy in [("GPA", fuzzy_gpa), ("CCA", fuzzy_cca), ("Attendance", fuzzy_att), ("Midterm", fuzzy_mid), ("FinalExam", fuzzy_final)]:
        c.drawString(2.5*cm, y, f"{var}: {fuzzy}")
        y -= 0.5*cm

    y -= 0.2*cm
    c.drawString(2*cm, y, "3. Rule Firing Strengths:")
    y -= 0.7*cm
    for rid, firing, output in firing_strengths:
        c.drawString(2.5*cm, y, f"{rid}: {output} (firing={firing:.3f})")
        y -= 0.5*cm

    y -= 0.2*cm
    c.drawString(2*cm, y, "4. Defuzzification (Tsukamoto):")
    y -= 0.7*cm
    c.drawString(2.5*cm, y, "Rumus: (Σ (α_i * z_i)) / (Σ α_i)")
    y -= 0.5*cm
    for alpha, z, output in zs:
        c.drawString(2.5*cm, y, f"{output}: α={alpha:.3f}, z={z:.3f}, α*z={alpha*z:.3f}")
        y -= 0.4*cm
    c.drawString(2.5*cm, y, f"Defuzzification value = {sum_num:.3f} / {sum_den:.3f} = {defuzz_value:.3f}")
    y -= 0.7*cm

    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y, f"Final Prediction: {pred_label}")
    y -= 0.7*cm
    c.drawString(2*cm, y, f"Defuzzification Value: {defuzz_value:.3f}")
    y -= 1.2*cm

    # Tambahkan penjelasan dan rumus fuzzy
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y, "Penjelasan & Rumus Fuzzy Tsukamoto:")
    y -= 0.7*cm
    c.setFont("Helvetica", 10)
    c.drawString(2.5*cm, y, "Setiap rule menghasilkan output crisp z_i dengan invers fungsi keanggotaan output.")
    y -= 0.5*cm
    c.drawString(2.5*cm, y, "Defuzzifikasi Tsukamoto:")
    y -= 0.5*cm
    c.drawString(2.7*cm, y, "z = (Σ (α_i * z_i)) / (Σ α_i)")
    y -= 0.5*cm
    c.drawString(2.5*cm, y, "Contoh invers output (monoton):")
    y -= 0.5*cm
    c.drawString(2.7*cm, y, "Poor: z = 2 - α")
    y -= 0.4*cm
    c.drawString(2.7*cm, y, "Needs Improvement: z = 3 - α")
    y -= 0.4*cm
    c.drawString(2.7*cm, y, "Satisfactory: z = 4 - α")
    y -= 0.4*cm
    c.drawString(2.7*cm, y, "Good: z = 4 + α")
    y -= 0.4*cm
    c.drawString(2.7*cm, y, "Excellent: z = 5 + α")
    y -= 0.6*cm

    # Add membership function image
    if os.path.exists(img_path):
        c.setFont("Helvetica", 11)
        c.drawString(2*cm, y, "GPA Membership Function:")
        y -= 0.5*cm
        c.drawImage(img_path, 2*cm, y-7*cm, width=12*cm, height=6*cm)
        y -= 7.2*cm

    c.setFont("Helvetica", 9)
    c.drawString(2*cm, y, "Triangle formula: μ(x) = (x-a)/(b-a) or (c-x)/(c-b)")
    y -= 0.4*cm
    c.drawString(2*cm, y, "Trapezoid formula: μ(x) = (x-a)/(b-a), 1, (d-x)/(d-c)")

    c.save()
    print(f"PDF saved to {pdf_path}")

save_to_pdf()
