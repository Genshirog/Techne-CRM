using CRM.Core.Entities;

namespace CRM.Infrastructure.Seeders;

public static class DeviceCatalogSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.DeviceTypes.Any()) return;

        // ──────────────────────────────────────────────────────────────────────
        // 1. DEVICE TYPES
        // ──────────────────────────────────────────────────────────────────────

        var typeLaptop      = new DeviceType { Name = "Laptop" };
        var typeDesktop     = new DeviceType { Name = "Desktop" };
        var typePrinter     = new DeviceType { Name = "Printer" };
        var typeCellphone   = new DeviceType { Name = "Cellphone" };
        var typeCCTV        = new DeviceType { Name = "CCTV" };
        var typeTablet      = new DeviceType { Name = "Tablet" };
        var typeNetworking  = new DeviceType { Name = "Networking Equipment" };

        context.DeviceTypes.AddRange(
            typeLaptop, typeDesktop, typePrinter,
            typeCellphone, typeCCTV, typeTablet, typeNetworking
        );
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 2. BRANDS
        // ──────────────────────────────────────────────────────────────────────

        // Laptop & Desktop Brands
        var brandDell   = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "Dell" };
        var brandHP     = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "HP" };
        var brandLenovo = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "Lenovo" };
        var brandAsus   = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "Asus" };
        var brandAcer   = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "Acer" };
        var brandApple  = new DeviceBrand { DeviceTypeId = typeLaptop.Id,    Name = "Apple" };

        // Desktop Brands
        var brandDellD  = new DeviceBrand { DeviceTypeId = typeDesktop.Id,   Name = "Dell" };
        var brandHPD    = new DeviceBrand { DeviceTypeId = typeDesktop.Id,   Name = "HP" };
        var brandLenovoD= new DeviceBrand { DeviceTypeId = typeDesktop.Id,   Name = "Lenovo" };

        // Printer Brands
        var brandEpson  = new DeviceBrand { DeviceTypeId = typePrinter.Id,   Name = "Epson" };
        var brandCanon  = new DeviceBrand { DeviceTypeId = typePrinter.Id,   Name = "Canon" };
        var brandBrother= new DeviceBrand { DeviceTypeId = typePrinter.Id,   Name = "Brother" };

        // Cellphone Brands
        var brandSamsung= new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "Samsung" };
        var brandAppleP = new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "Apple" };
        var brandXiaomi = new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "Xiaomi" };
        var brandOppo   = new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "OPPO" };
        var brandVivo   = new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "Vivo" };
        var brandRealme = new DeviceBrand { DeviceTypeId = typeCellphone.Id, Name = "Realme" };

        // CCTV Brands
        var brandHikvision = new DeviceBrand { DeviceTypeId = typeCCTV.Id,   Name = "Hikvision" };
        var brandDahua     = new DeviceBrand { DeviceTypeId = typeCCTV.Id,   Name = "Dahua" };
        var brandAxisCCTV  = new DeviceBrand { DeviceTypeId = typeCCTV.Id,   Name = "Axis" };

        // Tablet Brands
        var brandAppleT  = new DeviceBrand { DeviceTypeId = typeTablet.Id,   Name = "Apple" };
        var brandSamsungT= new DeviceBrand { DeviceTypeId = typeTablet.Id,   Name = "Samsung" };
        var brandLenovoT = new DeviceBrand { DeviceTypeId = typeTablet.Id,   Name = "Lenovo" };

        // Networking Brands
        var brandTPLink  = new DeviceBrand { DeviceTypeId = typeNetworking.Id, Name = "TP-Link" };
        var brandCisco   = new DeviceBrand { DeviceTypeId = typeNetworking.Id, Name = "Cisco" };
        var brandUbiquiti= new DeviceBrand { DeviceTypeId = typeNetworking.Id, Name = "Ubiquiti" };

        context.DeviceBrands.AddRange(
            brandDell, brandHP, brandLenovo, brandAsus, brandAcer, brandApple,
            brandDellD, brandHPD, brandLenovoD,
            brandEpson, brandCanon, brandBrother,
            brandSamsung, brandAppleP, brandXiaomi, brandOppo, brandVivo, brandRealme,
            brandHikvision, brandDahua, brandAxisCCTV,
            brandAppleT, brandSamsungT, brandLenovoT,
            brandTPLink, brandCisco, brandUbiquiti
        );
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 3. MODELS
        // ──────────────────────────────────────────────────────────────────────

        var models = new List<DeviceModel>
        {
            // ── Dell Laptops ─────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandDell.Id,    Name = "Inspiron 15" },
            new DeviceModel { DeviceBrandId = brandDell.Id,    Name = "Inspiron 14" },
            new DeviceModel { DeviceBrandId = brandDell.Id,    Name = "Latitude 5540" },
            new DeviceModel { DeviceBrandId = brandDell.Id,    Name = "XPS 15" },
            new DeviceModel { DeviceBrandId = brandDell.Id,    Name = "Vostro 3510" },

            // ── HP Laptops ───────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandHP.Id,      Name = "Pavilion 15" },
            new DeviceModel { DeviceBrandId = brandHP.Id,      Name = "EliteBook 840" },
            new DeviceModel { DeviceBrandId = brandHP.Id,      Name = "ProBook 450 G9" },
            new DeviceModel { DeviceBrandId = brandHP.Id,      Name = "Envy x360" },
            new DeviceModel { DeviceBrandId = brandHP.Id,      Name = "Victus 16" },

            // ── Lenovo Laptops ───────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandLenovo.Id,  Name = "ThinkPad E15" },
            new DeviceModel { DeviceBrandId = brandLenovo.Id,  Name = "IdeaPad Slim 5" },
            new DeviceModel { DeviceBrandId = brandLenovo.Id,  Name = "Legion 5" },
            new DeviceModel { DeviceBrandId = brandLenovo.Id,  Name = "Yoga 7i" },
            new DeviceModel { DeviceBrandId = brandLenovo.Id,  Name = "V15 G4" },

            // ── Asus Laptops ─────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandAsus.Id,    Name = "VivoBook 15" },
            new DeviceModel { DeviceBrandId = brandAsus.Id,    Name = "ZenBook 14" },
            new DeviceModel { DeviceBrandId = brandAsus.Id,    Name = "ROG Strix G15" },
            new DeviceModel { DeviceBrandId = brandAsus.Id,    Name = "TUF Gaming A15" },
            new DeviceModel { DeviceBrandId = brandAsus.Id,    Name = "ExpertBook B1" },

            // ── Acer Laptops ─────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandAcer.Id,    Name = "Aspire 5" },
            new DeviceModel { DeviceBrandId = brandAcer.Id,    Name = "Swift 3" },
            new DeviceModel { DeviceBrandId = brandAcer.Id,    Name = "Nitro 5" },
            new DeviceModel { DeviceBrandId = brandAcer.Id,    Name = "Predator Helios 300" },

            // ── Apple Laptops ────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandApple.Id,   Name = "MacBook Air M1" },
            new DeviceModel { DeviceBrandId = brandApple.Id,   Name = "MacBook Air M2" },
            new DeviceModel { DeviceBrandId = brandApple.Id,   Name = "MacBook Pro 14\" M3" },
            new DeviceModel { DeviceBrandId = brandApple.Id,   Name = "MacBook Pro 16\" M3" },

            // ── Dell Desktops ────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandDellD.Id,   Name = "OptiPlex 3000" },
            new DeviceModel { DeviceBrandId = brandDellD.Id,   Name = "Inspiron 3020" },
            new DeviceModel { DeviceBrandId = brandHPD.Id,     Name = "ProDesk 400 G9" },
            new DeviceModel { DeviceBrandId = brandHPD.Id,     Name = "EliteDesk 800 G6" },
            new DeviceModel { DeviceBrandId = brandLenovoD.Id, Name = "ThinkCentre M720" },
            new DeviceModel { DeviceBrandId = brandLenovoD.Id, Name = "IdeaCentre 5" },

            // ── Printers ─────────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandEpson.Id,   Name = "L3210" },
            new DeviceModel { DeviceBrandId = brandEpson.Id,   Name = "L5290" },
            new DeviceModel { DeviceBrandId = brandEpson.Id,   Name = "EcoTank ET-4850" },
            new DeviceModel { DeviceBrandId = brandCanon.Id,   Name = "PIXMA G2020" },
            new DeviceModel { DeviceBrandId = brandCanon.Id,   Name = "imageCLASS MF3010" },
            new DeviceModel { DeviceBrandId = brandBrother.Id, Name = "DCP-T420W" },
            new DeviceModel { DeviceBrandId = brandBrother.Id, Name = "HL-L2350DW" },

            // ── Cellphones ───────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandSamsung.Id, Name = "Galaxy A54" },
            new DeviceModel { DeviceBrandId = brandSamsung.Id, Name = "Galaxy S23" },
            new DeviceModel { DeviceBrandId = brandSamsung.Id, Name = "Galaxy A34" },
            new DeviceModel { DeviceBrandId = brandAppleP.Id,  Name = "iPhone 13" },
            new DeviceModel { DeviceBrandId = brandAppleP.Id,  Name = "iPhone 14" },
            new DeviceModel { DeviceBrandId = brandAppleP.Id,  Name = "iPhone 15" },
            new DeviceModel { DeviceBrandId = brandXiaomi.Id,  Name = "Redmi Note 12" },
            new DeviceModel { DeviceBrandId = brandXiaomi.Id,  Name = "Poco X5" },
            new DeviceModel { DeviceBrandId = brandOppo.Id,    Name = "A78" },
            new DeviceModel { DeviceBrandId = brandOppo.Id,    Name = "Reno 10" },
            new DeviceModel { DeviceBrandId = brandVivo.Id,    Name = "Y36" },
            new DeviceModel { DeviceBrandId = brandVivo.Id,    Name = "V29" },
            new DeviceModel { DeviceBrandId = brandRealme.Id,  Name = "C55" },
            new DeviceModel { DeviceBrandId = brandRealme.Id,  Name = "11 Pro" },

            // ── CCTV ─────────────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandHikvision.Id, Name = "DS-2CD2143G2-I" },
            new DeviceModel { DeviceBrandId = brandHikvision.Id, Name = "DS-2DE4425IWG-E" },
            new DeviceModel { DeviceBrandId = brandDahua.Id,     Name = "IPC-HDW2831T-AS" },
            new DeviceModel { DeviceBrandId = brandDahua.Id,     Name = "SD49425XB-HNR" },
            new DeviceModel { DeviceBrandId = brandAxisCCTV.Id,  Name = "P3245-V" },

            // ── Tablets ──────────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandAppleT.Id,   Name = "iPad 10th Gen" },
            new DeviceModel { DeviceBrandId = brandAppleT.Id,   Name = "iPad Air M1" },
            new DeviceModel { DeviceBrandId = brandAppleT.Id,   Name = "iPad Pro M2" },
            new DeviceModel { DeviceBrandId = brandSamsungT.Id, Name = "Galaxy Tab A8" },
            new DeviceModel { DeviceBrandId = brandSamsungT.Id, Name = "Galaxy Tab S8" },
            new DeviceModel { DeviceBrandId = brandLenovoT.Id,  Name = "Tab M10 Plus" },
            new DeviceModel { DeviceBrandId = brandLenovoT.Id,  Name = "Tab P11 Pro" },

            // ── Networking ───────────────────────────────────────────────────
            new DeviceModel { DeviceBrandId = brandTPLink.Id,   Name = "Archer AX73" },
            new DeviceModel { DeviceBrandId = brandTPLink.Id,   Name = "TL-SG108" },
            new DeviceModel { DeviceBrandId = brandTPLink.Id,   Name = "EAP670 Access Point" },
            new DeviceModel { DeviceBrandId = brandCisco.Id,    Name = "Catalyst 2960-X" },
            new DeviceModel { DeviceBrandId = brandCisco.Id,    Name = "RV340 Router" },
            new DeviceModel { DeviceBrandId = brandUbiquiti.Id, Name = "UniFi AP AC Pro" },
            new DeviceModel { DeviceBrandId = brandUbiquiti.Id, Name = "EdgeRouter X" },
        };

        context.DeviceModels.AddRange(models);
        context.SaveChanges();
    }
}