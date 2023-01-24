### Przygotowanie środowiska

1. Instalacja Node v16.16.0 (LTS)

- [Node.js](https://nodejs.org/en/blog/release/v16.16.0/) - środowisko uruchomieniowe dla JavaScript
- [NodeSource](https://github.com/nodesource/distributions/blob/master/README.md#deb) - Node.js Binary Distributions

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
  node src/index.js [plik_wejsciowy] [plik_wyjsciowy] [opcje]
```

- plik_wejsciowy - plik wejściowy z danymi np: `input.imp`
- plik_wyjsciowy - plik wyjściowy z danymi np: `output.asm` (opcjonalnie, jak nie podany to zapisać do pliku `output.asm`)
- opcje - opcjonalne parametry np: `-force` (nie przeprowadza sprawdzenia poprawności danych wejściowych)

### Przykładowe użycie

Wywołanie na wysokości katalogu projektu (pliku package.json)

```bash
 E:\> node .\compilator\src\index.js .\compilator\helper\test2a.imp .\compilator\out.asm
```
