import type { Dictionary } from './en';

const tr: Dictionary = {
  meta: {
    title: 'AUREON S5 — Akıllı Hassasiyet Ekskavatörü',
    description:
      'Yer altı tarama radarı ve santimetre hassasiyetinde GNSS konumlama ile 5 tonluk mini ekskavatör. Avrupa şehir içi altyapı işleri için Türkiye’de üretildi.',
    ogAlt: 'AUREON S5 Akıllı Hassasiyet Ekskavatörü',
  },

  brand: {
    name: 'AUREON',
    product: 'AUREON S5',
    slogan: 'Premium Machinery. Built to Endure.',
  },

  nav: {
    positioning: 'Konumlandırma',
    technology: 'Teknoloji',
    specifications: 'Teknik özellikler',
    fieldMap: 'Saha haritası',
    export: 'İhracat',
    contact: 'İletişim',
    menu: 'Menü',
    close: 'Kapat',
    languageLabel: 'Dil',
  },

  loader: {
    label: 'Sahne yükleniyor',
    hint: 'Tarama sekansı hazırlanıyor',
  },

  hero: {
    title: 'AUREON S5',
    subtitle: 'Akıllı Hassasiyet Ekskavatörü',
    scrollHint: 'Kaydır',
    tags: {
      weight: '5.000 kg',
      gnss: 'GNSS ±2,5 cm',
      noise: '94 dB (LwA)',
      gpr: 'GPR 4,0 m',
    },
    tagNames: {
      weight: 'Operasyon ağırlığı',
      gnss: 'Konum hassasiyeti',
      noise: 'Ses gücü seviyesi',
      gpr: 'Tarama derinliği',
    },
    sonarLabel: 'Yer Altı Tarama Radarı — Aktif',
    scanState: {
      idle: 'Beklemede',
      scanning: 'Taranıyor',
      resolved: 'Hatlar tespit edildi',
    },
    detectionFields: {
      depth: 'Derinlik',
      diameter: 'Ø',
      risk: 'Risk',
    },
    risk: {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
    },
    detections: [
      { id: 'water', label: 'PE-100 su hattı', depth: '2,40 m', diameter: 'Ø160 mm', risk: 'low' },
      { id: 'power', label: 'Orta gerilim kablo', depth: '1,15 m', diameter: 'Ø90 mm', risk: 'high' },
      { id: 'fiber', label: 'Fiber optik demet', depth: '0,85 m', diameter: 'Ø48 mm', risk: 'medium' },
      { id: 'sewer', label: 'Beton kanalizasyon hattı', depth: '3,20 m', diameter: 'Ø400 mm', risk: 'low' },
    ],
    message: {
      headline: 'Kazmadan önce görür.',
      sub: 'Yer altı tarama radarı, her S5’te standart.',
    },
    chapters: {
      arrival: 'Geliş',
      recognition: 'Tanıma',
      scan: 'Yer altı taraması',
      message: 'Mesaj',
    },
  },

  positioning: {
    eyebrow: 'Konumlandırma',
    manifesto: 'Şehir içi kazının en pahalı hatası, göremediğiniz şeye çarpmaktır.',
    body:
      'S5 tek bir soru etrafında kuruldu: kova girmeden önce yerin altında ne var. Geri kalan her şey — hidrolik, kabin, gürültü zarfı — zaten dolu bir sokakta çalışmaktan türedi.',
    stats: [
      { value: '€ 54.900', label: 'Net satış fiyatı' },
      { value: '5.000 kg', label: 'Operasyon ağırlığı' },
      { value: '±2,5 cm', label: 'Konum hassasiyeti' },
    ],
  },

  technology: {
    eyebrow: 'Teknoloji',
    title: 'Dört sistem, tek amaç',
    intro: 'Buradaki hiçbiri opsiyon paketi değil. Her S5 dördüyle birlikte banttan iner.',
    cards: [
      {
        id: 'gpr',
        title: 'GPR yer altı tarama',
        body:
          'Alt takımın altındaki çift frekanslı radar dizisi, ilk kesikten önce boru, kablo ve kanalları haritalar. Tespitler koordinat ve derinlikle kaydedilir.',
        metric: '4,0 m derinlik · ±3 cm',
        metricLabel: 'Tespit aralığı',
      },
      {
        id: 'gnss',
        title: 'GNSS / GPS konumlama',
        body:
          'RTK düzeltmeli çift antenli konumlama, kot ve hattı yerde ikinci bir operatör olmadan tutar. Proje yüzeyleri doğrudan kabin ekranına yüklenir.',
        metric: '±2,5 cm RTK',
        metricLabel: 'Konum doğruluğu',
      },
      {
        id: 'hydraulics',
        title: 'Akıllı hidrolik kontrol',
        body:
          'Yük duyarlı devre, debiyi motor devrine göre değil talebe göre ölçekler. Ataşman profilleri her ekipman için kaydedilir ve geri çağrılır.',
        metric: '248 bar',
        metricLabel: 'Çalışma basıncı',
      },
      {
        id: 'acoustics',
        title: 'Düşük gürültü ve titreşim',
        body:
          'İzole güç ünitesi ve sönümlenmiş kabin takozları, makineyi yerleşim alanı çalışma saatleri içinde tutar ve tam vardiyada operatör maruziyetini düşürür.',
        metric: '94 dB (LwA) · 2,1 m/s²',
        metricLabel: 'Ses gücü · el-kol titreşimi',
      },
    ],
  },

  specs: {
    eyebrow: 'Teknik özellikler',
    title: 'Teknik veriler',
    note: 'Değerler kauçuk paletli ve 0,16 m³ kovalı standart konfigürasyon içindir.',
    columns: { parameter: 'Parametre', value: 'Değer' },
    groups: [
      {
        id: 'dimensions',
        title: 'Boyutlar',
        rows: [
          ['Operasyon ağırlığı', '5.000 kg'],
          ['Nakliye uzunluğu', '5.480 mm'],
          ['Nakliye genişliği', '1.960 mm'],
          ['Kabin yüksekliği', '2.550 mm'],
          ['Zemindeki palet uzunluğu', '2.150 mm'],
          ['Yerden yükseklik', '345 mm'],
          ['Kuyruk dönüş yarıçapı', '1.290 mm'],
        ],
      },
      {
        id: 'engine',
        title: 'Motor',
        rows: [
          ['Model', 'AUREON D24-T'],
          ['Tip', '4 silindir turbo dizel'],
          ['Silindir hacmi', '2.400 cm³'],
          ['Anma gücü', '33,5 kW @ 2.200 dev/dk'],
          ['Maks. tork', '165 Nm @ 1.600 dev/dk'],
          ['Yakıt deposu', '90 L'],
        ],
      },
      {
        id: 'hydraulics',
        title: 'Hidrolik',
        rows: [
          ['Çalışma basıncı', '248 bar'],
          ['Ana pompa debisi', '2 × 58 L/dk'],
          ['Yardımcı devre', '75 L/dk'],
          ['Dönüş torku', '11,4 kNm'],
          ['Hidrolik deposu', '62 L'],
          ['Kontrol', 'Yük duyarlı, elektro-oransal'],
        ],
      },
      {
        id: 'performance',
        title: 'Kazı performansı',
        rows: [
          ['Maks. kazı derinliği', '3.720 mm'],
          ['Zemin seviyesinde maks. erişim', '6.140 mm'],
          ['Maks. boşaltma yüksekliği', '4.180 mm'],
          ['Kova koparma kuvveti', '41,2 kN'],
          ['Arm koparma kuvveti', '26,8 kN'],
          ['Standart kova', '0,16 m³'],
          ['Yürüyüş hızı', '2,6 / 4,5 km/s'],
        ],
      },
      {
        id: 'electronics',
        title: 'Elektronik',
        rows: [
          ['GPR tarama derinliği', '4,0 m'],
          ['GPR doğruluğu', '±3 cm'],
          ['GNSS doğruluğu', '±2,5 cm (RTK)'],
          ['Ekran', '10,1" yansımasız dokunmatik'],
          ['Telematik', '4G LTE / CAN-bus'],
          ['Cihaz üstü kayıt', '30 gün'],
        ],
      },
      {
        id: 'compliance',
        title: 'Emisyon ve uyumluluk',
        rows: [
          ['Ses gücü seviyesi', '94 dB (LwA)'],
          ['Operatör kulak gürültüsü', '76 dB (LpA)'],
          ['El-kol titreşimi', '2,1 m/s²'],
          ['Tüm vücut titreşimi', '0,48 m/s²'],
          ['Emisyon seviyesi', 'EU Stage V'],
          ['Belgelendirme', 'CE · ISO 9001'],
        ],
      },
    ],
  },

  map: {
    eyebrow: 'Referans saha haritası',
    title: 'AUREON’u çalışırken görün',
    subtitle: 'Broşüre değil, sahaya bakın. Size en yakın AUREON’u ziyaret edin.',
    nearestPrefix: 'Size en yakın AUREON',
    locating: 'Konum belirleniyor',
    locationFallback: 'Varsayılan referans noktası: Madrid, İspanya',
    distanceUnit: 'km',
    listView: 'Liste',
    globeView: 'Küre',
    dragHint: 'Döndürmek için sürükleyin · bir işaret seçin',
    selectPrompt: 'Saha kaydını görmek için bir işaret seçin.',
    emptyRegion: 'Bu bölgede henüz bir AUREON yok —',
    emptyRegionCta: 'ilk siz olun',
    disclaimer: 'Referans saha bilgileri temsilidir.',
    sectors: {
      'urban-renewal': 'Şehir içi altyapı yenileme',
      'road-sewer': 'Yol ve kanalizasyon',
      landscaping: 'Peyzaj ve çevre düzenleme',
      fiber: 'Fiber ve telekom altyapı',
      rebuild: 'Kentsel yeniden yapılanma',
      energy: 'Enerji altyapı hatları',
      'urban-dig': 'Şehir içi kazı ve altyapı',
      municipal: 'Belediye altyapı işleri',
      water: 'Su hattı ve drenaj',
      'road-urban': 'Yol ve kentsel altyapı',
    },
    countries: {
      slovenia: 'Slovenya',
      romania: 'Romanya',
      bulgaria: 'Bulgaristan',
      sweden: 'İsveç',
      ukraine: 'Ukrayna',
      azerbaijan: 'Azerbaycan',
      georgia: 'Gürcistan',
      tunisia: 'Tunus',
      libya: 'Libya',
      algeria: 'Cezayir',
    },
    panel: {
      sector: 'Sektör',
      inField: 'Sahada',
      months: 'ay',
      hours: 'çalışma saati',
      certificate: 'Orijinallik belgesi',
      serial: 'Seri no.',
      production: 'Üretim',
      verified: 'Doğrulandı',
      cta: 'Bu makineyi yerinde gör',
      photoPlaceholder: 'Saha görseli',
      close: 'Paneli kapat',
    },
    modal: {
      titlePrefix: 'Saha ziyareti talebi',
      body:
        'Talebiniz AUREON’a iletilir. Ev sahibi firmadan onay alındıktan sonra sizinle iletişime geçilir.',
      privacyNote: 'Ev sahibi firmanın iletişim bilgileri bu sitede hiçbir zaman yayınlanmaz.',
      fields: {
        name: 'Ad soyad',
        company: 'Firma',
        email: 'E-posta',
        phone: 'Telefon',
        date: 'Tercih edilen tarih',
        note: 'Not',
      },
      submit: 'Talep gönder',
      sending: 'Gönderiliyor',
      success: 'Talebiniz alındı. 24 saat içinde dönüş yapılacaktır.',
      error: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
      close: 'Kapat',
    },
  },

  exportSection: {
    eyebrow: 'İhracat ve belgelendirme',
    title: 'Banttan şantiyenize',
    body:
      'Her ünite eksiksiz bir gümrük dosyasıyla çıkar. İspanya’daki bir şantiyeye teslim, yüklemeden itibaren 12–16 gün sürer.',
    steps: [
      { id: 'production', label: 'Üretim' },
      { id: 'qc', label: 'Kalite kontrol' },
      { id: 'atr', label: 'A.TR düzenleme' },
      { id: 'loading', label: 'Yükleme (CMR)' },
      { id: 'customs', label: 'Gümrük' },
      { id: 'delivery', label: 'Teslim' },
    ],
    badges: ['CE', 'Stage V', 'ISO 9001', 'A.TR dolaşım belgesi', 'Gümrük Birliği'],
    gtipLabel: 'Gümrük tarife kodu',
    gtip: '8429.52.10.00.00',
  },

  contact: {
    eyebrow: 'İletişim',
    title: 'Teklif isteyin',
    body:
      'Makinenin nerede çalışacağını ve neyi kazacağını yazın. Yazılı teklif, teslim süresi ve size en yakın referans saha ile dönüş yapıyoruz.',
    responseNote: 'Bir iş günü içinde yazılı yanıt.',
    form: {
      name: 'Ad soyad',
      company: 'Firma',
      country: 'Ülke',
      countryPlaceholder: 'Ülke seçin',
      selectPlaceholder: 'Seçin',
      email: 'E-posta',
      phone: 'Telefon',
      interest: 'İlgi alanı',
      message: 'Mesaj',
      submit: 'Gönder',
      sending: 'Gönderiliyor',
      success: 'Mesajınız alındı. Bir iş günü içinde dönüş yapılacaktır.',
      error: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
      required: 'Zorunlu',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
    },
    interests: [
      { id: 'purchase', label: 'Satın alma' },
      { id: 'dealership', label: 'Bayilik' },
      { id: 'visit', label: 'Saha ziyareti' },
    ],
  },

  footer: {
    quickLinks: 'Bölümler',
    legal: 'Yasal',
    gtipLabel: 'GTİP',
    gtip: '8429.52.10.00.00',
    rights: 'Tüm hakları saklıdır.',
    company: 'AUREON Makina San. ve Tic. A.Ş.',
    address: 'Organize Sanayi Bölgesi, Ankara, Türkiye',
  },

  a11y: {
    skipToContent: 'İçeriğe geç',
    scrollProgress: 'Sayfa kaydırma ilerlemesi',
    logoAlt: 'AUREON kalkan logosu',
    heroCanvasAlt:
      'AUREON S5 ekskavatörünün yer altı tarama radarıyla gömülü altyapı hatlarını taradığı üç boyutlu görünüm.',
    globeAlt: 'AUREON referans sahalarını gösteren etkileşimli küre.',
  },
};

export default tr;
