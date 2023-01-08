switch (this->cond.compType)
    { //IF L >= R
      case EComperator::GEQ:
        //If 0 >= R - L then jump true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.right));
        result.push_back(pickRefVar(EInstruction::SUB, cond.left));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.right->getId()});
        //result.push_back({EInstruction::SUB, EParameterType::VAR_ID, cond.left->getId()});
        result.push_back({EInstruction::JZERO, EParameterType::LABEL_ID, trueJumpLabel.value});
        result.push_back({EInstruction::JUMP, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      //If L <= R
      case EComperator::LEQ:
        //If L - R <= 0 then jump true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.left));
        result.push_back(pickRefVar(EInstruction::SUB, cond.right));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.left->getId()});
        //result.push_back({EInstruction::SUB, EParameterType::VAR_ID, cond.right->getId()});
        result.push_back({EInstruction::JZERO, EParameterType::LABEL_ID, trueJumpLabel.value});
        result.push_back({EInstruction::JUMP, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      //If L > R
      case EComperator::GREATER:
        //If L - R > 0 then jump true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.left));
        result.push_back(pickRefVar(EInstruction::SUB, cond.right));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.left->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.right->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, trueJumpLabel.value});
        result.push_back({EInstruction::JUMP, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      //If L < R
      case EComperator::LESSER:
      //If 0 < R - L then jump true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.right));
        result.push_back(pickRefVar(EInstruction::SUB, cond.left));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.right->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.left->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, trueJumpLabel.value});
        result.push_back({EInstruction::JUMP, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      //If L == R
      case EComperator::EQUAL:
        //If L >= R and L <= R <==> If L < R or L > R then false
        //If 0 < R - L then jmp false
        result.push_back(pickRefVar(EInstruction::LOAD, cond.right));
        result.push_back(pickRefVar(EInstruction::SUB, cond.left));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.right->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.left->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, falseJumpLabel.value});
        //If L - R > 0 then jump false
        result.push_back(pickRefVar(EInstruction::LOAD, cond.left));
        result.push_back(pickRefVar(EInstruction::SUB, cond.right));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.left->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.right->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      case EComperator::DIFFERENT:
        //If L < R or L > R then true
        //If 0 < R - L then jmp true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.right));
        result.push_back(pickRefVar(EInstruction::SUB, cond.left));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.right->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.left->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, trueJumpLabel.value});
        //If L - R > 0 then jump true
        result.push_back(pickRefVar(EInstruction::LOAD, cond.left));
        result.push_back(pickRefVar(EInstruction::SUB, cond.right));
        //result.push_back({EInstruction::LOAD, EParameterType::VAR_ID, cond.left->getId()});
        //result.push_back({EInstruction::SUB,  EParameterType::VAR_ID, cond.right->getId()});
        result.push_back({EInstruction::JPOS, EParameterType::LABEL_ID, trueJumpLabel.value});
        result.push_back({EInstruction::JUMP, EParameterType::LABEL_ID, falseJumpLabel.value});
        break;
      default:
        break;

    }
