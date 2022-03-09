class IdNotFoundError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'NotFoundError';
    }
}

class IdInvalidError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'IdInvalidError';
    }
}


class FetchFailedError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'FetchFailedError';
    }
}

class DeleteFailedError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'FetchFailedError';
    }
}

class DatabaseConnectionError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'DatabaseConnectionError';
    }
}

class ImageUploadError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'ImageUploadError';
    }
}

class CreateReourcesError extends Error{
    constructor(msg){
        super(msg);
        this.name = 'createReourcesError';
    }
}

export {DatabaseConnectionError, ImageUploadError, DeleteFailedError, CreateReourcesError, IdInvalidError, IdNotFoundError};