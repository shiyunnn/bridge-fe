export enum ErrorCodes {
    Success = 0,
    UnknownError = 1,
    Unauthorized = 2,
    PermissionDenied = 3,
    BadRequest = 4,
    BadFieldRequest = 5,
    MultipleBadFieldRequest = 6,
  }
  
  export enum FieldErrorCodes {
    Required = 'required',
    InvalidType = 'invalid_type',
    MinLength = 'min_length',
    MaxLength = 'max_length',
    MinItems = 'min_items',
    MaxItems = 'max_items',
    Minimum = 'minimum',
    Maximum = 'maximum',
    Enum = 'enum',
    Duplicated = 'duplicated',
    InvalidValue = 'invalid_value',
    AlreadyExist = 'already_exist',
    DoesNotExist = 'does_not_exist',
    NumItems = 'num_items',
  }
  