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
  Required = "required",
  InvalidType = "invalid_type",
  MinLength = "min_length",
  MaxLength = "max_length",
  MinItems = "min_items",
  MaxItems = "max_items",
  Minimum = "minimum",
  Maximum = "maximum",
  Enum = "enum",
  Duplicated = "duplicated",
  InvalidValue = "invalid_value",
  AlreadyExist = "already_exist",
  DoesNotExist = "does_not_exist",
  NumItems = "num_items",
}

export enum ProjectStatus {
  Draft = 1,
  EstimatesReady = 2,
  InProgress = 3,
  Completed = 4,
  Cancelled = 5,
}

export enum TaskType {
  General = 0,
  FE = 1,
  BE = 2,
}

export enum RoleType {
  PM = 'PM',
  FE = 'FE',
  BE = 'BE',
  QA = 'QA',
}

export enum PriorityType {
  Low = 1,
  Medium = 2,
  High = 3,
}
