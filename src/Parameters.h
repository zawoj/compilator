#ifndef PARAMETERS_H
#define PARAMETERS_H


#include <stdio.h>
#include <fstream>

class Parameters {
public:
    Parameters(int argc, char** argv) {
        if (argc < 2)
            return;
        this->input = fopen(argv[1], "r");
        this->output = std::ofstream(argv[2]);
    }

    void checkCorrectness() {
        if (!this->areValid()) {
            this->showError();
            exit(-1);
        }
    }

    FILE* input;
    std::ofstream output; 

private:
    bool areValid() const { 
        return this->input != NULL && this->output.is_open();
    }

    static void showError() {
        printf("Give parameters:\n"
               "./compiler <input_filename> <output_filename>\n");
    }
};


#endif //PARAMETERS_H
