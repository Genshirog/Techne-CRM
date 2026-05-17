using CRM.Core.Entities;

namespace CRM.Infrastructure.Seeders;

public static class DiagnosisCatalogSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.DiagnosisCatalogs.Any()) return;

        var diagnoses = new List<DiagnosisCatalog>
        {
            // ── Laptop / Desktop ─────────────────────────────────────────────
            new DiagnosisCatalog
            {
                Name        = "Overheating",
                Description = "Device temperature exceeds safe operating limits due to blocked vents, dried thermal paste, or faulty fan.",
            },
            new DiagnosisCatalog
            {
                Name        = "No Power / Won't Turn On",
                Description = "Device does not respond when power button is pressed. May indicate faulty battery, power adapter, or motherboard.",
            },
            new DiagnosisCatalog
            {
                Name        = "Blue Screen of Death (BSOD)",
                Description = "System crashes with a blue error screen. Usually caused by driver conflicts, RAM issues, or corrupted OS files.",
            },
            new DiagnosisCatalog
            {
                Name        = "Slow Performance",
                Description = "Device runs significantly slower than expected. May be caused by malware, insufficient RAM, or failing storage drive.",
            },
            new DiagnosisCatalog
            {
                Name        = "Virus / Malware Infection",
                Description = "Presence of malicious software causing abnormal behavior, data theft, or system damage.",
            },
            new DiagnosisCatalog
            {
                Name        = "Hard Drive / SSD Failure",
                Description = "Storage device is unresponsive, making clicking sounds, or showing bad sectors detected via S.M.A.R.T. analysis.",
            },
            new DiagnosisCatalog
            {
                Name        = "RAM Failure",
                Description = "Memory module is faulty or incompatible, causing random crashes, BSODs, or failure to boot.",
            },
            new DiagnosisCatalog
            {
                Name        = "Motherboard Failure",
                Description = "Main circuit board is damaged or has failed components, preventing the system from functioning.",
            },
            new DiagnosisCatalog
            {
                Name        = "GPU / Display Adapter Issue",
                Description = "Graphics processing unit is failing or incompatible, causing display artifacts, crashes, or no video output.",
            },
            new DiagnosisCatalog
            {
                Name        = "OS Corruption / Won't Boot",
                Description = "Operating system files are corrupted or missing, preventing normal startup.",
            },
            new DiagnosisCatalog
            {
                Name        = "Keyboard Malfunction",
                Description = "One or more keys are unresponsive, sticking, or registering incorrect input.",
            },
            new DiagnosisCatalog
            {
                Name        = "Touchpad Not Working",
                Description = "Touchpad is unresponsive or erratic, possibly due to driver issues or physical damage.",
            },
            new DiagnosisCatalog
            {
                Name        = "Charging Port Damage",
                Description = "Charging port is loose, bent, or broken, preventing proper power delivery to the device.",
            },
            new DiagnosisCatalog
            {
                Name        = "Battery Not Charging / Swollen Battery",
                Description = "Battery fails to charge or has swollen due to age or overcharging, requiring immediate replacement.",
            },
            new DiagnosisCatalog
            {
                Name        = "Cracked / Broken Screen",
                Description = "Display panel has physical damage resulting in broken glass, dead pixels, or no display.",
            },
            new DiagnosisCatalog
            {
                Name        = "Backlight Failure",
                Description = "Screen appears very dim or completely dark despite the device being on. Inverter or backlight strip issue.",
            },
            new DiagnosisCatalog
            {
                Name        = "Liquid Damage",
                Description = "Device was exposed to liquid, causing corrosion or short circuits on internal components.",
            },
            new DiagnosisCatalog
            {
                Name        = "USB Port Not Working",
                Description = "One or more USB ports fail to detect or power connected devices.",
            },
            new DiagnosisCatalog
            {
                Name        = "Wi-Fi / Bluetooth Not Working",
                Description = "Wireless adapter fails to detect networks or pair with devices. May be driver or hardware related.",
            },
            new DiagnosisCatalog
            {
                Name        = "Speaker / Audio Not Working",
                Description = "No sound output or distorted audio from built-in speakers or audio jack.",
            },
            new DiagnosisCatalog
            {
                Name        = "Webcam Not Working",
                Description = "Built-in or external camera is not detected or produces no image.",
            },

            // ── Printer ──────────────────────────────────────────────────────
            new DiagnosisCatalog
            {
                Name        = "Paper Jam",
                Description = "Paper is stuck inside the printer mechanism, preventing print jobs from completing.",
            },
            new DiagnosisCatalog
            {
                Name        = "Ink / Toner Issue",
                Description = "Cartridge is empty, clogged, or incorrectly installed, resulting in poor print quality or no printing.",
            },
            new DiagnosisCatalog
            {
                Name        = "Printer Not Detected",
                Description = "Device is not recognized by the computer via USB or network connection.",
            },
            new DiagnosisCatalog
            {
                Name        = "Print Quality Issues",
                Description = "Output shows streaks, faded areas, or incorrect colors due to dirty print heads or low ink.",
            },

            // ── Cellphone ────────────────────────────────────────────────────
            new DiagnosisCatalog
            {
                Name        = "Cracked Phone Screen",
                Description = "Mobile device display has cracked glass or damaged LCD/OLED panel affecting visibility or touch response.",
            },
            new DiagnosisCatalog
            {
                Name        = "Phone Not Charging",
                Description = "Mobile device does not charge when connected to a power source. May be charging port, cable, or battery issue.",
            },
            new DiagnosisCatalog
            {
                Name        = "Phone Overheating",
                Description = "Mobile device gets excessively hot during normal use, affecting performance and battery life.",
            },
            new DiagnosisCatalog
            {
                Name        = "Phone Water Damage",
                Description = "Liquid ingress into the mobile device causing corrosion or component failure.",
            },
            new DiagnosisCatalog
            {
                Name        = "No Signal / SIM Not Detected",
                Description = "Device cannot detect the SIM card or connect to mobile networks.",
            },
            new DiagnosisCatalog
            {
                Name        = "Phone Speaker / Mic Not Working",
                Description = "Audio output or microphone is not functioning during calls or media playback.",
            },

            // ── CCTV / Networking ────────────────────────────────────────────
            new DiagnosisCatalog
            {
                Name        = "CCTV No Video Feed",
                Description = "Camera is powered but produces no image on the monitor or NVR/DVR.",
            },
            new DiagnosisCatalog
            {
                Name        = "CCTV Night Vision Not Working",
                Description = "Infrared LEDs on the camera are not functioning, resulting in black image in low-light conditions.",
            },
            new DiagnosisCatalog
            {
                Name        = "NVR / DVR Not Recording",
                Description = "Network or digital video recorder fails to store footage. May be a storage or configuration issue.",
            },
            new DiagnosisCatalog
            {
                Name        = "Network Connectivity Loss",
                Description = "Device cannot connect to the local network or internet. May involve router, switch, or cable issues.",
            },
            new DiagnosisCatalog
            {
                Name        = "Slow Network / Low Bandwidth",
                Description = "Network performance is significantly below expected speeds, affecting productivity.",
            },
            new DiagnosisCatalog
            {
                Name        = "Router / Access Point Failure",
                Description = "Networking device is unresponsive, overheating, or unable to distribute network connections.",
            },

            // ── General ──────────────────────────────────────────────────────
            new DiagnosisCatalog
            {
                Name        = "Physical Damage (Drop/Impact)",
                Description = "Device has sustained physical damage from being dropped or impacted, affecting structural integrity or components.",
            },
            new DiagnosisCatalog
            {
                Name        = "Power Surge Damage",
                Description = "Electrical surge has damaged internal components, often affecting the power supply or motherboard.",
            },
            new DiagnosisCatalog
            {
                Name        = "Unknown / Requires Further Testing",
                Description = "Issue has not yet been identified. Device requires deeper diagnostic procedures to determine root cause.",
            },
        };

        context.DiagnosisCatalogs.AddRange(diagnoses);
        context.SaveChanges();
    }
}