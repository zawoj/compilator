### Przygotowanie środowiska

1. Instalacja Node.js

- [Node.js](https://nodejs.org/en/) - środowisko uruchomieniowe dla JavaScript

2. Instalacja zależności

```bash
  npm install
```

3. Zbudowanie projektu

```bash
  npm run build
```

4. Uruchomienie projektu

```bash
  node build/index.js [plik_wejsciowy] [plik_wyjsciowy] [opcje]
```

- plik_wejsciowy - plik wejściowy z danymi np: `input.imp`
- plik_wyjsciowy - plik wyjściowy z danymi np: `output.asm` (opcjonalnie, jak nie podany to zapisać do pliku `output.asm`)
- opcje - opcjonalne parametry np: `-force` (nie przeprowadza sprawdzenia poprawności danych wejściowych)
