---
title: "Olimpiada üçün C++-da Performans Mühəndisliyi, Dərs 1"
date: 2025-05-24
description: "Dərs 1 -- giriş/çıxış, kompilyatorlar, vektorizasiya"
star: true
tocHeading: Mündəricat
---

<center>TED Super Finalçılar Sinfi, Qonaq Dərs (Barış Namazov)</center>

## Mündəricat

## Motivasiya

Sürətli kod yazmağı niyə bilək:
- Kompüter arxitekturasını öyrənmək üçün yaxşı başlanğıcdır.
- Yarışlarda edilə bilən performans səhvlərindən uzaq olursunuz.
- Bəzən alt-məsələni yaxud tam məsələni sürətləndirilmiş brute-force həll
  ilə həll etmək mümkündür.

Müasir CPU-lar çoxsaylı nüvələr,
keş yaddaşlarının qat-qat hissələri,
pipelining və vektor təlimat dəstləri (SIMD) kimi mürəkkəb xüsusiyyətlərlə təchiz olunub.
Əvvəllər alqoritmlərin sürətini təxmin etmək üçün yalnız əməliyyat sayını hesablamaq kifayət edirdi,
amma indi fərqli prosessorlar,
kompilyator optimizasiyaları və keşdən yaxşı istifadə bu yanaşmanı natamam edir.
Sadəcə “hərfi əməliyyat sayma” ilə real icra vaxtını dəqiq proqnozlaşdırmaq mümkün deyil.
Aşağıda isə bu yeni imkanlardan faydalanaraq kodu necə sürətləndirə biləcəyimizi göstərəcəyik.

## Giriş/Çıxış

C++-da standart giriş-çıxış axınları (`cin` və `cout`) rahatlıq üçün nəzərdə tutulub,
amma performans baxımından yavaşdırlar. Aşağıdakı üsullarla sürətini artıra bilərsiniz.

### `ios_base::sync_with_stdio(false);`

Bu funksiya C və C++ axınlarının (`stdio` və `iostream`) sinxronizasiyasını söndürür.
Normalda onlar sinxron işləyir ki, qarışıqlıq olmasın, amma bu `cin` və `cout`-un sürətini azaldır.

```cpp
ios_base::sync_with_stdio(false);
````

Bu sətri əlavə etməklə `cin` və `cout` daha sürətli işləyir, amma `scanf/printf` ilə qarışıq istifadə edərkən ehtiyatlı olun.

[Ətraflı cppreference](https://en.cppreference.com/w/cpp/io/ios_base/sync_with_stdio)

---

### `cin.tie(nullptr);`

Standartda `cin` axını `cout`-a bağlıdır (tied), yəni `cin` əməliyyatından əvvəl `cout` avtomatik flush olunur. Bu, interaktiv proqramlarda faydalıdır, amma əlavə gecikmə yaradır.

```cpp
cin.tie(nullptr);
```

Bu sətri yazmaqla `cin` və `cout`-un bu bağını aradan qaldırıb performansı artırırsınız.

[Ətraflı cppreference](https://en.cppreference.com/w/cpp/io/basic_ios/tie)

---

### `#define endl '\n'`

`endl` sadəcə sətir sonu simvolu əlavə etmir, həm də axını flush edir.
Flush əməliyyatı çıxışı gecikdirə bilər.

```cpp
#define endl '\n'
```

Bu definisiya `endl` əvəzinə sadəcə `'\n'` istifadə etməyə imkan verir, çıxışı sürətləndirir. Əgər interaktiv proqramdırsa və çıxış dərhal göstərilməlidirsə, flush edilməlidir.

---

### İnteraktiv məsələlərdə flush

İnteraktiv proqramlarda çıxışın dərhal göstərilməsi vacibdir. Bu halda:

* `ios_base::sync_with_stdio(false);` və `cin.tie(nullptr);` istifadə etməyin, yaxud
* lazım olan yerdə `cout << flush;` ilə axını manual flush edin.

---

### Nümunə

```cpp
#include <iostream>

using namespace std;

#define endl '\n'

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    for (int i = 0; i < n; ++i) {
        cout << i << endl;
    }

    // İnteraktiv məsələlərdə lazım ola bilər, hər dəfə giriş oxunandan əvvəl:
    // cout << flush;

    return 0;
}
```

---

### Ümumi tövsiyə

* Sürətli giriş-çıxış üçün yuxarıdakı üç texnikanı istifadə edin.
* İnteraktiv proqramlarda çıxışın dərhal görünməsi üçün flush əməliyyatlarına diqqət edin.
* `scanf/printf` ilə `ios_base::sync_with_stdio` qarışdırmaq olmaz.


## Kompilyatorlar

**Kompilyator növləri**
- Əvvəlcədən tərtib edən kompilyator: mənbə kodunu tamamilə maşın koduna çevirərək icra edilə bilən fayl yaradır (məsələn, C, C++, Rust).
- Tərcüməçi: mənbə kodunu sətrin-sətrin oxuyub birbaşa icra edir, əvvəlcədən maşin kodu yaratmır (məsələn, Python).
- JIT (Just-In-Time): proqram icrası zamanı kritik hissələri maşın koduna çevirərək performansı optimallaşdırır və çevikliyi saxlayır (məsələn, JavaScript, Java, C#, PyPy).

**C++ kompilyatorları**
- GCC – açıq mənbəli kompilyator; olimpiadalar və onlayn judge-lərdə standart seçimdir.
- clang – LLVM əsasında hazırlanmış kompilyator; sürətli diaqnostika, kod tamamlama və statik analiz dəstəyi.

**Maraqlı alətlər**

- Godbolt (Compiler Explorer) – kodun fərqli kompilyator versiyalarında assembly-yə çevrilməsini vizuallaşdıran onlayn vasitə (https://godbolt.org).
- cppinsights – şablonların genişləndirməsini və compiler transformasiyasını göstərən onlayn servis (https://cppinsights.io).
- Clang-Tidy – kod keyfiyyəti və stil yoxlamaları üçün statik analiz aləti.
- Valgrind – yaddaş sızması və performans təhlili üçün profil aləti.
- perf (Linux) – nüvəyə yaxın performans statistikasını toplamaq üçün komanda xətti aləti.


## GCC optimallaşdırma səviyyələri

GCC-də optimallaşdırma səviyyəsi `-O` flag-i ilə idarə olunur. Bu səviyyələr kodun sürətini və ölçüsünü dəyişir, tərtib vaxtına da təsir göstərir. Aşağıda əsas optimallaşdırma səviyyələri və onların istifadə məqsədləri göstərilmişdir:

| Səviyyə   | Təsviri |
|-----------|---------|
| **-O0**   | Heç bir optimallaşdırma tətbiq olunmur. Dəyişənlər və funksiyalar olduğu kimi saxlanılır, debug üçün əlverişlidir. |
| **-O1**   | Əsas optimallaşdırmalar həyata keçirilir: ölü kodun silinməsi, dövrlərin sadələşdirilməsi və s. |
| **-O2**   | Daha geniş optimallaşdırma dəsti aktivləşir: dövr transformasiyaları, avtomatik vektorizasiya və funksiyaların daha effektiv yerləşdirilməsi. Olimpiadalar və online judge-lərdə standart olaraq bu istifadə olunur. |
| **-O3**   | Hesablama intensiv kodlar üçün əlavə aqressiv optimallaşdırmalar (loop unrolling, daha geniş inlining və s.). Bəzən faydalıdır, bəzən faydasız və ya hətta zərərli ola bilər. |
| **-Ofast** | `-O3` səviyyəsinə əlavə olaraq `-ffast-math` aktivləşdirilir. Bu isə bəzi standartlara zidd transformasiyalarla nəticənin dəqiqliyini riskə ata bilər, amma performans daha yüksək ola bilər. |

### Kompilyasiya əmrləri

```bash
# Balanslı və təhlükəsiz optimallaşdırma
g++ -std=c++20 -O2 main.cpp -o main

# Aqressiv optimallaşdırma
g++ -std=c++20 -O3 main.cpp -o main

# Maksimum performans, daha riskli optimallaşdırmalarla
g++ -std=c++20 -Ofast main.cpp -o main
````

### Yarışlarda `#pragma` istifadəsi

Yarışlarda faylın əvvəlində `#pragma` direktivləri ilə optimallaşdırmanı kompilyator səviyyəsində göstərə bilərsiniz. GCC bu direktivləri dəstəkləyir və optimallaşdırmanı uyğun şəkildə tətbiq edir.

```cpp
#pragma GCC optimize("O3")

#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // ...
}
```

* `optimize("O3")` yerinə `Ofast` də yazıla bilər, lakin UB (undefined behavior) riskini nəzərə almaq vacibdir.
* `target(...)` direktivi xüsusi təlimat dəstlərini aktiv edir. Bu təlimatlar CPU səviyyəsində sürəti artıra bilər, lakin yalnız həmin təlimatlar dəstəklənirsə effektivdir.
* Yarış mühitində bu direktivlərin təsiri sistemdən asılı ola bilər; bəzi onlayn judge-lərdə `-march=native` və ya `target` direktivləri gözlənilən effekti verməyə bilər.

Kompilyasiya əmrinə optimizasiya flag-i əlavə etmək (`-O2`, `-O3`) ilə `#pragma GCC optimize` arasındakı fərq nədir?
Birbaşa əmrə əlavə etmək bütün kod fayllarına va daxili funksiyalara (məsələn, `std::sort`) da tətbiq olunur,
amma pragma yalnızca yazılan kod faylına. Amma yarışlarda əmri biz idarə etmirik deyə pragma yazmağa məcbur qalırıq.

### Nümunə kod
Aşağıdakı kodu Godbolt saytında fərqli flag-lar ilə yoxlayın:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    constexpr size_t N = 1'000'000;
    vector<double> a(N), b(N);

    for (size_t i = 0; i < N; ++i) {
        a[i] = static_cast<double>(i);
        b[i] = static_cast<double>(N - i);
    }

    auto t0 = chrono::high_resolution_clock::now();
    double sum = 0.0;

    for (size_t i = 0; i < N; ++i) {
        sum += a[i] * b[i];
    }

    auto t1 = chrono::high_resolution_clock::now();
    chrono::duration<double> dt = t1 - t0;

    cout << "sum = " << sum
         << "    time = " << dt.count() << " s\n";
    return 0;
}
```

## Vektorizasiya (SIMD)

Vektorizasiya (Single Instruction Multiple Data) eyni əməliyyatı "paralel" şəkildə bir neçə məlumat elementi üzərində icra etməyə imkan verir. Burada paralel dedikdə, 1 instruksiyada nəzərdə tuturuq (bir neçə nüvə yox).
Məsələn, AVX təlimat dəsti 256-bit registrindən istifadə edir;
bu registr 8 × 32-bit tam ədədi eyni vaxtda saxlayır.
Beləliklə, vektorizasiya olunmuş kodda tək bir `vaddps` (və ya `vpaddd`) təlimatı 8 tam ədədi toplamağa qadirdir,
halbuki vektorizasiya olunmamış (scalar) kodda eyni işi görmək üçün 8 ayrı `add` təlimatı lazım olardı.


### Avto-vektorizasiya

Xoşbəxtlikdən, kompilyator bizə vektorizasiya ilə kömək edə bilər.

- GCC-də `-O2` və yuxarı səviyyələrdə `-ftree-vectorize` avtomatik olaraq aktivdir.
- `-march=native` flag-i CPU-nun mövcud vektor təlimatlarını açır və daha geniş parallelliyi təmin edir.
- **Yarış mühitində** komanda sətri dəyişdirilə bilmədikdə, SIMD dəstlərini mənbə kodunda aktivləşdirmək üçün:
  ```cpp
  #pragma GCC target("avx2,bmi2,lzcnt,popcnt")
  ```
- Avto-vektorizasiya üçün bəzən `Ofast` lazımdır. Godbolt saytında generasiya olunmuş assembly-yə baxmaq kömək olur.

C++-da olimpiadaçılar arasında məşhur olan `bitset` tipi də avtomatik vektorizasiya olunan tipdir.

* Avto-vektorizasiya adətən sadə massiv əməliyyatlarına tətbiq olunur, məsələn:

  ```cpp
  for (size_t i = 0; i < n; ++i)
      a[i] += b[i];

  for (size_t i = 0; i < n; ++i)
      sum += c[i];
  ```
* Vectorizasiyadan maksimum fayda almaq üçün mümkün qədər kiçik məlumat tipindən istifadə edin (məsələn, `uint16_t`).
  Kiçik tip daha çox elementin bir vektor registrində (256-bit) emalına imkan verir.


### Manual vektorizasiya

> Yarışda etmək tövsiyə olunmur!

Bu, C++ kodunda assembly instruksiyaları yazmağa bənzəyir.

* `<immintrin.h>` başlığı ilə birbaşa AVX/SSE təlimatlarından istifadə edin.
* Məlumatı 32 bayt sərhədinə (alignment) uyğun yerləşdirmək üçün `alignas(32)` və ya `_mm_malloc` istifadə edin.
* Məsələn, float vektor toplama AVX ilə:

  ```cpp
  #include <immintrin.h>
  void add(const float* a, const float* b, float* c, size_t n) {
      size_t i = 0;
      // float = 32 bit, bir 256-lıq vektora 8 ədəd sığır
      for (; i + 7 < n; i += 8) {
          __m256 va = _mm256_load_ps(a + i);
          __m256 vb = _mm256_load_ps(b + i);
          __m256 vc = _mm256_add_ps(va, vb);
          _mm256_store_ps(c + i, vc);
      }
      // qalan hissəni manual cəmləyirik, çünki 8-dən az qalıb
      for (; i < n; ++i) {
          c[i] = a[i] + b[i];
      }
  }
  ```


### Məsələlər

- https://codeforces.com/contest/911/problem/G (Educational G)
- https://codeforces.com/contest/817/problem/E (Educational E)
- https://codeforces.com/contest/896/problem/E (Div1. E)
- https://codeforces.com/contest/1039/problem/E (Div1. E)
    - Mənim manual vektorizasiya həllim: https://codeforces.com/contest/1039/submission/319309696

## Dərs 2-də nələr olacaq?

Dərs 2-də yaddaşı daha yaxşı başa düşəcəyik (stack və heap),
keş haqqında öyrənəcəyik,
C++-ın standart tiplərindən daha sürətli olan data strukturları görəcəyik.
